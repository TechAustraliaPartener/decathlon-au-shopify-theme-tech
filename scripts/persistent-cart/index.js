import { getCustomer, createOrUpdateCustomer } from './queries';
import {
  getStoredShopifyCart,
  setStoredShopifyCart,
  removeStoredShopifyCart,
  setWasLoggedIn,
  removeWasLoggedIn,
  getWasLoggedIn,
  cache
} from './storage';
import { localStorageAvailable, cookiesAvailable } from '../utilities/storage';
import pcConfig from './config';
import scriptsConfig from '../shared/config';
import cartReconciler from './cart-reconciler';
import fetch from 'unfetch';
import 'promise-polyfill/src/polyfill';
import { setCartCookie, getCartCookie, removeCartCookie } from './cart-cookies';
import onCartAjaxUpdated from './add-to-cart';
import updateCartUI from './update-cart-ui';
import logoutHandlerInit from './logout';
import customCheckoutInit from '../shared/custom-checkout';
import getErrorMessage from '../utilities/logging';

const {
  SHOPIFY_API: { GET_CART, UPDATE_CART }
} = pcConfig;
const {
  SELECTORS: { CART_COUNT, CUSTOMER_ID }
} = scriptsConfig;

/**
 * Update the UI and storage, return the cart
 * @param {Object} cart - A Shopify cart object
 * @returns {Object} cart - the same cart
 */
const finalCartUpdates = cart => {
  if (!cart) {
    throw new Error('Cart not passed to handler for updating UI.');
  }
  // @TODO - Is this necessary. Do we actually want this to be ephemeral and go away?
  setStoredShopifyCart(cart);
  // Update the UI with the new count
  updateCartUI(cart.item_count);
  return cart;
};

/**
 * Update a customer in the DB with a rehydrated cart from Shopify
 * Should only be called in case of cartID/token expiration
 * At this point, our master cartID was nullified, and webhooks
 * need to look for the customer with this new cart's token / cartID
 * @param {Object} cart - The (locally stored) Shopify cart object
 * @returns {Object} The cart belonging to the returned, updated customer object
 */
const updateDBCustomer = (cart = getStoredShopifyCart()) => {
  // Need to update the customer in the DB only if we had a Shopify expiration event
  return createOrUpdateCustomer({
    customerID: cache.customer.customerID,
    cart
  }).then(updatedCustomer => updatedCustomer.cart);
};

/**
 * Use a reconciled cart object as payload to update the Shopify cart
 * This is considered "rehydrating" if the previously used cartID/token was found to be expired by Shopify
 * @param {Object} reconciledCarts - An object of line_item objects to use to update the cart
 * @returns {Object} - The updated Shopify cart
 */
const updateShopifyCart = (reconciledCarts = null) => {
  if (!reconciledCarts) {
    throw new Error('updateShopifyCart was called without a payload.');
  }
  const newCartID = cache.customerCartExpired
    ? cache.masterShopifyCart.token
    : cache.customer.cartID;
  if (!newCartID) {
    throw new Error(
      `Before updating the Shopify cart, there is no token to set.`
    );
  }
  /**
   * If the `cache.customerCartExpired` boolean is `true`,
   * clear all of the existing cart-related cookies before (re-)setting the cart cookie
   */
  if (cache.customerCartExpired) {
    // Set the cart cookie
    setCartCookie(newCartID);
  }

  /**
   * Now call "/cart/update.js" (a POST request)
   * to the Shopify API to update the cart in their DB
   */
  const updateOptions = {
    headers: {
      'Content-Type': 'application/json',
      pragma: 'no-cache',
      'cache-control': 'no-cache'
    },
    method: 'POST',
    body: JSON.stringify({ updates: reconciledCarts })
  };
  const fetchConfig = [UPDATE_CART, updateOptions];

  // Call fetch with the above config
  return fetch(...fetchConfig)
    .then(res => res.json())
    .then(updatedShopifyCart => {
      // Check that the cart is an object containing an item_count
      if (updatedShopifyCart && 'item_count' in updatedShopifyCart) {
        // Update the cart in localStorage to match the newly updated Shopify cart
        setStoredShopifyCart(updatedShopifyCart);
        return updatedShopifyCart;
      }
      // Error if something above did not work
      throw new Error(
        `No cart returned after attempting to update after setting cart cookie with cartID (${newCartID})${
          reconciledCarts ? `, with reconciled carts: ${reconciledCarts}` : ''
        }.`
      );
    });
};

/**
 * Reconcile two carts, if needed
 * @param {boolean} shouldReconcileCarts - Whether to proceed with cart reconciliation
 * @returns {Object} An object where the key/value pairs are set in key/value pairs: {variant_id: quantity}
 */
const reconcileCarts = () => {
  /**
   * If we're here, we already know that the existing cart from page load
   * has a different token value than the customer's cartID in the DB
   * We need to reconcile: 1) The cart from page load, and 2) if we've detected
   * that Shopify has expired an existing cart, the DB customer.cart, otherwise
   * the master Shopify cart
   */
  const currentCart = getStoredShopifyCart();
  const reconciledCarts = cartReconciler(
    // If Shopify expired the cart, we want to reconcile with just the DB cart contents (so pass null here)
    cache.customerCartExpired ? null : currentCart,
    /**
     * NB - This is the only place in which cart contents from the DB can be used
     * for updating the cart, due to a Shopify expiration event
     */
    cache.customerCartExpired ? cache.customer.cart : cache.masterShopifyCart
  );
  return reconciledCarts;
};

/**
 * Check whether carts need reconciliation (Shopify and customer's DB cart ID do not match)
 * Carts should be reconciled if 1) There were items in the cart on load,
 * 2) the cart ID on load doesn't match the customer's cartID in the DB, and
 * 3) the user wasn't logged in on last load (reconciliation only needs to happen directly
 * after login), or
 * 4) Shopify has expired our existing cart from the DB
 * @returns {boolean} - Should reconcileCarts be run?
 */
const shouldReconcileCarts = () => {
  const existingCustomer = cache.customer;
  const shopifyCart = getStoredShopifyCart();
  /**
   * Return false if there were no items in the cart
   * or the customer was already logged in on previous load and Shopify has
   * not expired the cartID in our database
   */
  if (!shopifyCart || (getWasLoggedIn() && !cache.customerCartExpired)) {
    return false;
  }
  /*
   * Return true if we've detected that Shopify has expired our cart
   */
  if (cache.customerCartExpired) {
    return true;
  }
  /*
   * Errors if there is no existing customer in the DB at this point or no shopifyCart token
   */
  if (!existingCustomer || !shopifyCart.token) {
    throw new Error(
      `Checking whether carts should be reconciled failed because ${
        cache.customerID
      } or a Shopify cart ID could not be found.`
    );
  }
  // Check existingCustomer.cartID against shopifyCart token value
  const cartIDsMismatch =
    existingCustomer &&
    existingCustomer.cartID &&
    existingCustomer.cartID !== shopifyCart.token;
  return cartIDsMismatch;
};

/**
 * Call out to create a new customer with cart if the cart has items (was set) and isn't already in our DB
 * @param {Object} [shopifyCart] - A locally stored Shopify cart object
 * @returns {boolean} - Whether or not to continue on with the Promise chain for other PC tasks
 */
const assignCartIfNew = (shopifyCart = getStoredShopifyCart()) => {
  let existingCustomer = cache.customer;
  const setNewCustomerOrCart =
    shopifyCart &&
    (!existingCustomer || (existingCustomer && !existingCustomer.cartID));
  cache.setNewCustomerOrCart = setNewCustomerOrCart;
  if (setNewCustomerOrCart) {
    return createOrUpdateCustomer({
      customerID: cache.customerID,
      cart: shopifyCart
    }).then(customer => {
      // Update the in-memory store of the new or updated customer
      cache.customer = customer;
      existingCustomer = customer;
      return false;
    });
  }
  /**
   * At this point, we know that we didn't create or update a customer
   * If a customer exists and has a cartID, continue
   */
  if (existingCustomer && existingCustomer.cartID) {
    // Return true to let the Promise chain continue with the existing customer object
    return true;
  }
  /**
   * There's nothing more to do if the cart is empty and there isn't already a customer in the DB
   * or there is a customer with no cart
   * There may be a customer with no cart if a customer is in our DB without a cart
   * and this is a page load event with 0 items in the cart (we do not use an empty cart to update or create
   * a customer in the DB - in the event that the Shopify `cart.token` changes again)
   */
  if (
    (!shopifyCart && !existingCustomer) ||
    (existingCustomer && !existingCustomer.cartID)
  ) {
    return false;
  }
  // If none of the above conditions passes, there's a problem
  throw new Error(
    `Customer ${
      cache.customerID
    } should already have been set in the database, but has not been.`
  );
};

/**
 * Fetch a Shopify cart, with or without first setting the cartID (i.e., the "page-load" vs the "master" carts)
 * @param {string} [cartID] - A cart ID (aka, token) to be used to set the cart cookie
 * before making the GET request
 * @returns {Object} A Shopify cart
 */
const fetchShopifyCart = cartID => {
  if (cartID) {
    setCartCookie(cartID);
  }
  return fetch(GET_CART, {
    headers: { pragma: 'no-cache', 'cache-control': 'no-cache' }
  })
    .then(res => res.json())
    .then(cart => {
      if (!cart) {
        throw new Error(
          `Could not fetch a cart from Shopify with cartID ${cartID ||
            getCartCookie}.`
        );
      }
      return cart;
    });
};

/**
 * Get a Shopify cart on page load from the Storefront AJAX API
 * Called without first setting a cart cookie, unlike the "master" cart
 * @returns {Object|null} - A Shopify cart or null if there is nothing in the cart on page load
 */
const fetchPageLoadShopifyCart = () =>
  cache.currentCartCount > 0 ? fetchShopifyCart() : Promise.resolve(null);

/**
 * Save off a Shopify cart locally, for reference
 * @param {Object} [cart] - The Shopify cart object
 * @returns {Object|null} cart - A cart if one was stored, null if one was not stored
 */
const persistPageLoadShopifyCart = cart => {
  // Persist the Shopify cart locally, for the moment, then return it
  // If a cart is not passed, will remove stored cart from localStorage, otherwise set it
  if (cart) {
    setStoredShopifyCart(cart);
  } else {
    removeStoredShopifyCart();
  }
  return getStoredShopifyCart();
};

/**
 * Save the boolean flagging whether a customer's cart was expired by Shopify
 * @param {boolean} expired - Whether or not Shopify has expired the cart we've saved in the DB
 * @returns {boolean} Returns the `expired` argument
 */
const persistCustomerCartExpired = expired => {
  cache.customerCartExpired = expired;
  return expired;
};

/**
 * Check whether Shopify has expired the cart associated with the cartID associcated with
 * a customer record in the database
 * @param {Object} [masterShopifyCart] - The cart retrieved from Shopify after setting with the customer.cartID from the DB
 * @returns {boolean} -  Whether or not Shopify has expired the cart (should rarely be true, usually false)
 */
const isCustomerCartExpired = (masterShopifyCart = cache.masterShopifyCart) =>
  masterShopifyCart && masterShopifyCart.token !== cache.customer.cartID;

/**
 * Get a "master" Shopify cart by passing in the customer.cartID from the database
 * This cartID will be used to set the cart cookie before GETting a cart from the AJAX API
 * Referring to this cart as the "master"
 * @returns {Promise<object>} - A Shopify cart
 */
const fetchMasterShopifyCart = () => {
  /**
   * Pass the cart cookie to make sure we're getting the master cart.
   * `fetchShopifyCart` will use the passed cartID to set the cart cookie
   * before making a GET request to the Shopify AJAX API
   */
  return fetchShopifyCart(cache.customer.cartID);
};

/**
 * Persist the "master" Shopify cart, retrieved by first setting the cart cookie
 * to the value of the customer.cartID from the DB
 * @param {Object} cart - The cart object returned from Shopify
 * @returns {Object} The same cart object
 */
const persistMasterShopifyCart = cart => {
  cache.masterShopifyCart = cart;
  return cart;
};

/**
 * Check whether the token of the cart fetched on page load matches the customer's cartID
 * No need to overwrite the cookie or many other things in this flow if they match
 * @returns {boolean} - Should we fetch the "master" cart?
 */
const shouldMasterCartBeFetched = () => {
  const pageLoadShopifyCart = getStoredShopifyCart();
  const pageLoadToken =
    pageLoadShopifyCart && pageLoadShopifyCart.token
      ? pageLoadShopifyCart.token
      : null;
  const customerCartID =
    cache.customer && cache.customer.cartID ? cache.customer.cartID : null;
  if (pageLoadToken === customerCartID) {
    return false;
  }
  return true;
};

/**
 * Assign a customer object DB to a global customer object for further reference, return
 * @params {Object|null} retrievedCustomer - The value of a customer retrieved from the custom DB
 * @returns {Object|null} - The same value
 */
const persistCustomer = retrievedCustomer => {
  // Persist the customer locally, for the moment (could be null)
  cache.customer = retrievedCustomer;
  return retrievedCustomer;
};

/**
 * The end of the PC Promise chain, called if it's determined that carts need
 * reconciling and Shopify and/or the DB, and the UI, need updating
 * @param {Object} reconciledCarts - The object used to call to the Shopify AJAX API to update a cart
 * @returns {Object} - The Shopify cart after the PC flow has finished completely
 */
const handleAllNecessaryUpdates = reconciledCarts =>
  updateShopifyCart(reconciledCarts)
    .then(cart => (cache.customerCartExpired ? updateDBCustomer(cart) : cart))
    .then(finalCartUpdates);

/**
 * Determine whether to fetch a master Shopify cart (using the customer's cartID)
 * If needed, fetch and persist, otherwise, return the cart from page load
 * @returns {Object} - A Shopify cart
 */
const getCartForUpdates = () =>
  shouldMasterCartBeFetched()
    ? fetchMasterShopifyCart().then(persistMasterShopifyCart)
    : Promise.resolve(getStoredShopifyCart());

/**
 * Kick off a new portion of the Promise chain by getting the "master" Shopify
 * cart (which will use the customer's cartID from the DB as the cart cookie value)
 * Will check and persist the master cart and a boolean flagging whether Shopify has expired
 * the existing customer.cartID. Finally, will determine whether to reconcile carts
 * @returns {*} - A call to continue cart reconciliation and update tasks or to end by storing the master
 * cart and update the UI with its item_count
 */
const handleReconciliationAndExpiration = () => {
  let cartToUseForUpdates;
  return getCartForUpdates()
    .then(cart => {
      cartToUseForUpdates = cart;
      return isCustomerCartExpired(cart);
    })
    .then(persistCustomerCartExpired)
    .then(shouldReconcileCarts)
    .then(shouldReconcile => {
      if (shouldReconcile) {
        const reconciledCarts = reconcileCarts();
        return handleAllNecessaryUpdates(reconciledCarts);
      }
      return finalCartUpdates(cartToUseForUpdates);
    });
};

/**
 * Call a chain of functions to create or update a customer in our DB,
 * get and locally save items from a Shopify cart (if needed), and update
 * Shopify (if needed)
 */
const pcInit = customer => {
  persistCustomer(customer);
  return fetchPageLoadShopifyCart()
    .then(persistPageLoadShopifyCart)
    .then(assignCartIfNew)
    .then(shouldHandleReconciliationAndExpiration =>
      shouldHandleReconciliationAndExpiration
        ? handleReconciliationAndExpiration()
        : `${
            cache.setNewCustomerOrCart
              ? `A customer was just created or updated: ' ${
                  cache.customer.customerID
                }`
              : "There's no saved customer, or the saved customer has no cart, and the Shopify cart is empty, so ending"
          }`
    );
};

/**
 * If there is a customerID in the template on page load, an attempt is made to fetch
 * the customer from the DB, which will return a customer Object or null (no such customer in the DB).
 * - Kicks off PC with this value. Also binds the Ajax Handler for add-to-cart actions.
 * - Runs a Promise chain for enabling persistent cart, catches errors.
 * - Sets a flag to indicate the customer was logged in at the end of running.
 * @param {Object|null} customer - The customer value retrieved from the application DB (or null if no customer was yet in the DB)
 */
const initWithCustomer = customer => {
  console.log('Persistent Cart JS loaded');
  // Initialize logout handler for clearing storage and cart-related cookies on logout
  logoutHandlerInit();
  // Initalize muilti-device checkout handling
  customCheckoutInit();
  // Initialize the persistent cart flow
  pcInit(customer)
    .then(response => {
      if (response && response.error) {
        throw new Error(getErrorMessage(response.error));
      }
      /**
       * Set a flag showing that the user was logged in as of this time.
       * Do this only in the "finally" block of when all of the PC flow is complete
       * This flag will be unset as soon as the page loads without a customerID
       */
      setWasLoggedIn();
    })
    // Catch all errors from ensuing calls
    .catch(error => {
      // @TODO - Promise.finally might need shimming. Instead, just call setLoggedIn on both success and failure
      setWasLoggedIn();
      console.error(
        'Persistent cart errors or messages: ',
        getErrorMessage(error)
      );
    });
  // Pass PC client initialization as a callback to the add-to-cart module
  onCartAjaxUpdated(quantity => {
    /**
     * First update the cart quantity to add to what was in the template at page load
     */
    cache.currentCartCount += quantity;
    // Now call the application init function
    pcInit(customer);
  });
};

/**
 * If there is no customerID in the template on page load, run cleanup
 * - If and only if the user transitioned from a logged-in state:
 * - Clears cart cookies
 * - Updates the UI with cart item count 0
 * Also
 * - Removes logged in flag that was set the last time the page loaded
 * with a customer ID in the template
 * - Removes any saved Shopify cart in storage
 */
const initWithoutCustomer = () => {
  /**
   * If a flag was previously set that the user was logged in and now they are not
   * remove the cart cookie, and also update the cart item count to 0.
   * Cart cookie reset is also bound to click on the logout button, but testing
   * indicated that a fallback might be necessary.
   */
  if (getWasLoggedIn()) {
    removeCartCookie();
    updateCartUI(0);
  }
  /**
   * Set a flag showing that the user was not logged in as of this time.
   * Do this only when there is no customerID in the template
   * This flag will be set after page loads without a customerID and
   * when the PC flow is complete
   */
  removeWasLoggedIn();
  /**
   * Remove any locally saved cart information
   */
  removeStoredShopifyCart();
};

/**
 * Kick off persistent cart, called on DOM Content Loaded
 * Will check for the following, and not proceed if conditions aren't met
 * 1) A customer exists
 * 2) A query for the customer can be made to the DB successfully - a health check of the PC app
 * 2) localStorage is supported and usable - TBD whether this is necessary
 * 3) Cookies are enabled/usable
 * Catches and logs for the chain of request-making functions it calls.
 */
const pcCheckInit = () => {
  // Get cid from template
  const cidEl = document.querySelector(CUSTOMER_ID);
  cache.currentCartCount = parseInt(
    document.querySelector(CART_COUNT).value,
    10
  );
  // Persist cid locally
  cache.customerID = cidEl && cidEl.value ? cidEl.value : null;
  // Test for a customer plus localStorage and cookie support (enabled), or do not proceed
  if (localStorageAvailable && cookiesAvailable) {
    if (cache.customerID) {
      // @TODO set timer for health check here?
      getCustomer(cache.customerID)
        .then(customerResponse => {
          if (
            !customerResponse ||
            (typeof customerResponse === 'object' &&
              !('error' in customerResponse))
          ) {
            initWithCustomer(customerResponse);
            return;
          }
          if ('error' in customerResponse) {
            throw new Error(customerResponse.error);
          }
        })
        .catch(error => {
          throw new Error(
            `Persistent cart not responding: ${getErrorMessage(error)}`
          );
        });
    } else {
      initWithoutCustomer();
    }
  }
};

/**
 * Call initializing function on DOM Content Loaded
 */
document.addEventListener('DOMContentLoaded', pcCheckInit);
