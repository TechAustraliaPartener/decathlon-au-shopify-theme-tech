// @ts-check

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
import { persistedStorefrontAPITest } from '../utilities/api-tester';
import {
  localStorageAvailable,
  sessionStorageAvailable,
  cookiesAvailable
} from '../utilities/storage';
import pcConfig from './config';
import scriptsConfig, { DEBUG } from '../shared/config';
import { cartReconciler } from './cart-reconciler';
import fetch from 'unfetch';
import 'promise-polyfill/src/polyfill';
import { setCartCookie, getCartCookie, removeCartCookie } from './cart-cookies';
import onCartAjaxUpdated from './add-to-cart';
import updateCartUI from './update-cart-ui';
import logoutHandlerInit from './logout';
import { customCheckoutInit } from '../shared/custom-checkout';
import getErrorMessage from '../utilities/logging';
import { chainPromises } from '../utilities/chain-promises';

const {
  SHOPIFY_API: { GET_CART, UPDATE_CART, ADD_TO_CART }
} = pcConfig;
const {
  SELECTORS: { CART_COUNT, CUSTOMER_ID }
} = scriptsConfig;

const shopifyPostOptions = {
  headers: {
    'Content-Type': 'application/json',
    pragma: 'no-cache',
    'cache-control': 'no-cache'
  },
  method: 'POST'
};

/**
 * Update the UI and storage, return the cart
 * @param {Cart} cart - A Shopify cart object
 * @returns {Cart} cart - the same cart
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
 * @param {Cart} cart - The (locally stored) Shopify cart object
 * @returns {Promise<Cart>} The cart belonging to the returned, updated customer object
 */
const updateDBCustomer = (cart = getStoredShopifyCart()) => {
  // Need to update the customer in the DB only if we had a Shopify expiration event
  return createOrUpdateCustomer({
    customerID: cache.customer.customerID,
    cart
  }).then(updatedCustomer => updatedCustomer.cart);
};

/**
 * Handle errors thrown by calls to the Shopify AJAX API for cart endpoints
 * @param {Response} shopifyResponse - Response from a call to a Shopify
 * AJAX API cart endpoint
 * @returns {Promise<Object>} - Dependent on the calling function
 */
const parseShopifyCartResponse = async shopifyResponse => {
  const responseObj = await shopifyResponse.json();
  if (shopifyResponse.ok) {
    return responseObj;
  }
  if (
    responseObj.description &&
    responseObj.description.toLowerCase() === 'cannot find variant'
  ) {
    throw new Error('A product in the cart is invalid');
  }
  throw new Error(
    `Attempt to update or rebuild cart failed with error: ${responseObj.message}`
  );
};

/**
 * Add an item to a Shopify cart using the Ajax API
 * Never rejects or throws, just returns `null` if the item cannot be added
 * to the cart (suspected to be the result of trying to add a now-invalid
 * product variant)
 * @param {Object} item
 * @param {string} item.id
 * @param {string} item.quantity
 * @returns {Promise<Item|null>} - A product variant object (result of a
 * successful addition) or null
 */
const addToCart = ({ id, quantity }) => {
  const updateOptions = {
    ...shopifyPostOptions,
    body: JSON.stringify({ id, quantity })
  };
  /**
   * Call fetch with the above config.
   * Return `null` for any failed 'add' - Likely cause is an invalid product
   * variant, and it will just not get re-added to the Shopify cart
   */
  return fetch(ADD_TO_CART, updateOptions)
    .then(parseShopifyCartResponse)
    .catch(() => null);
};

/**
 * Attempt to rebuild the Shopify cart item-by-item by using the `/cart/add.js`
 * endpoint (if a call to `/cart/update.js` has failed)
 * @param {Object} reconciledCarts
 * @returns {Promise<Cart>} - A Shopify cart
 */
const rebuildCart = reconciledCarts => {
  if (DEBUG)
    console.debug(
      '🛒 rebuildCart called with reconciledCarts: ',
      reconciledCarts
    );
  const items = Object.keys(reconciledCarts);
  return chainPromises(
    items.map(item => ({ id: item, quantity: reconciledCarts[item] })),
    addToCart
  ).then(validatedItems => {
    if (DEBUG) console.debug('ITEMS!!!', validatedItems);
    return fetchShopifyCart();
  });
};

/**
 * Call to update the Shopify cart using the `/cart/update.js` endpoint
 * @param {Object} reconciledCarts
 * @returns {Promise<Cart|null>} - A Shopify cart
 */
const updateCart = reconciledCarts => {
  const updateOptions = {
    ...shopifyPostOptions,
    body: JSON.stringify({ updates: reconciledCarts })
  };
  // Call fetch with the above config
  return fetch(UPDATE_CART, updateOptions).then(parseShopifyCartResponse);
};

/**
 * Use a reconciled cart object as payload to update the Shopify cart
 * This is considered "rehydrating" if the previously used cartID/token was
 * found to be expired by Shopify
 * @param {Object} reconciledCarts - An object of line_item objects to use to
 * update the cart
 * @returns {Promise<Cart>} - The updated Shopify cart
 */
const modifyShopifyCart = (reconciledCarts = null) => {
  if (!reconciledCarts) {
    throw new Error('modifyShopifyCart was called without a payload.');
  }
  if (DEBUG)
    console.debug('🛒 reconciledCarts in modifyShopifyCart: ', reconciledCarts);
  const newCartID = cache.customerCartExpired
    ? cache.masterShopifyCart.token
    : cache.customer.cartID;
  if (!newCartID) {
    throw new Error(
      `Before updating the Shopify cart, there is no token to set.`
    );
  }
  /**
   * If the `cache.customerCartExpired` boolean is `true`, update the cart cookie
   */
  if (cache.customerCartExpired) {
    setCartCookie(newCartID);
  }
  /**
   * Now call "/cart/update.js" (a POST request)
   * to the Shopify API to update the cart in their DB
   */
  return updateCart(reconciledCarts)
    .catch(error => {
      console.error('/cart/update.js returned with error', error);
      /**
       * If an error was thrown attempting to use `/cart/update.js`, now try
       * to rebuild the cart using sequential `/cart/add.js` requests
       */
      return rebuildCart(reconciledCarts);
    })
    .then(updatedCart => {
      if (updatedCart && 'item_count' in updatedCart) {
        if (DEBUG) console.debug('🛒 Updated cart!!!', updatedCart);
        // Update the cart in localStorage to match the newly updated Shopify cart
        setStoredShopifyCart(updatedCart);
        return updatedCart;
      }
      throw new Error(
        `No cart returned after attempting to update or rebuild using token ${newCartID}${
          reconciledCarts ? `, with reconciled carts: ${reconciledCarts}` : ''
        }.`
      );
    });
};

/**
 * Reconcile two carts, if needed
 * @returns {Object} An object where the key/value pairs are set in
 * key/value pairs: {variant_id: quantity}
 */
const reconcileCarts = () => {
  /**
   * If we're here, we already know that the existing cart from page load
   * has a different token value than the customer's cartID in the DB
   * We need to reconcile: 1) The cart from page load, and 2) if we've detected
   * that Shopify has expired an existing cart, the DB customer.cart, otherwise
   * the master Shopify cart
   */
  return cartReconciler(
    /**
     * NOTE - Previously, the logic for the first parameter, in the event
     * of a cart expiration event, was to set it to `null`. This resulted in
     * existing items in cart being thrown away instead of reconciled.
     * Changing to always pass in the cart from page load: `getStoredShopifyCart()`
     */
    getStoredShopifyCart(),
    /**
     * NB - This is the only place in which cart contents from the DB can be used
     * for updating the cart, due to a Shopify expiration event
     */
    cache.customerCartExpired ? cache.customer.cart : cache.masterShopifyCart
  );
};

/**
 * Check whether carts need reconciliation (Shopify and customer's DB cart ID
 * do not match)
 * Carts should be reconciled if 1) There were items in the cart on load,
 * 2) the cart ID on load doesn't match the customer's cartID in the DB, and
 * 3) the user wasn't logged in on last load (reconciliation only needs to
 * happen directly after login), or
 * 4) Shopify has expired our existing cart from the DB
 * @returns {boolean} - Should reconcileCarts be run?
 */
const shouldReconcileCarts = () => {
  const existingCustomer = cache.customer;
  const shopifyCart = getStoredShopifyCart();
  /*
   * Return true if we've detected that Shopify has expired our cart
   */
  if (cache.customerCartExpired) {
    return true;
  }
  /**
   * Return false if there were no items in the cart
   * or the customer was already logged in on previous page load
   */
  if (!shopifyCart || getWasLoggedIn()) {
    return false;
  }
  /**
   * Errors if there is no existing customer in the DB at this point or no
   * `shopifyCart.token`
   */
  if (!existingCustomer || !shopifyCart.token) {
    throw new Error(
      `Checking whether carts should be reconciled failed because
      ${cache.customerID} or a Shopify cart ID could not be found.`
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
 * @param {Cart} [shopifyCart] - A locally stored Shopify cart object
 * @returns {boolean} - Whether or not to continue on with the Promise chain for other PC tasks
 */
const assignCartIfNew = (shopifyCart = getStoredShopifyCart()) => {
  let existingCustomer = cache.customer;
  const setNewCustomerOrCart =
    shopifyCart &&
    (!existingCustomer || (existingCustomer && !existingCustomer.cartID));
  cache.setNewCustomerOrCart = setNewCustomerOrCart;
  if (setNewCustomerOrCart) {
    if (DEBUG)
      console.debug(`💵 Customer ${cache.customerID} needs to be added to
    the DB or their record updated.`);
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
    if (DEBUG)
      console.debug(`💵 Customer ${cache.customerID} is in the DB with a cart,
      no update needed at this point (assignCartIfNew).`);
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
    if (DEBUG) console.debug(`🛒 is empty, so don't update DB.`);
    return false;
  }
  // If none of the above conditions passes, there's a problem
  throw new Error(
    `Customer ${cache.customerID} should already have been set in the database, but has not been.`
  );
};

/**
 * Fetch a Shopify cart, with or without first setting the cartID (i.e., the "page-load" vs the "master" carts)
 * @param {string} [cartID] - A cart ID (aka, token) to be used to set the cart cookie
 * before making the GET request
 * @returns {Promise<Cart>} A Shopify cart
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
 * @returns {Promise<Cart|null>} - A Shopify cart or null if there is nothing in the cart on page load
 */
const fetchPageLoadShopifyCart = () =>
  cache.currentCartCount > 0 ? fetchShopifyCart() : Promise.resolve(null);

/**
 * Save off a Shopify cart locally, for reference
 * @param {Cart} [cart] - The Shopify cart object
 * @returns {Cart|null} cart - A cart if one was stored, null if one was not stored
 */
const persistPageLoadShopifyCart = cart => {
  // Persist the Shopify cart locally, for the moment, then return it
  // If a cart is not passed, will remove stored cart from localStorage, otherwise set it
  if (cart) {
    if (DEBUG) console.debug('🛒 Setting cart to localStorage: ', cart);
    setStoredShopifyCart(cart);
  } else {
    if (DEBUG) console.debug('🛒 Removing cart from localStorage');
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
 * Check whether Shopify has expired the cart associated with the cartID associated with
 * a customer record in the database
 * @param {Cart} [masterShopifyCart] - The cart retrieved from Shopify after setting with the customer.cartID from the DB
 * @returns {boolean} -  Whether or not Shopify has expired the cart (should rarely be true, usually false)
 */
const isCustomerCartExpired = (masterShopifyCart = cache.masterShopifyCart) =>
  masterShopifyCart && masterShopifyCart.token !== cache.customer.cartID;

/**
 * Get a "master" Shopify cart by passing in the customer.cartID from the database
 * This cartID will be used to set the cart cookie before GETting a cart from the AJAX API
 * Referring to this cart as the "master"
 * @returns {Promise<Cart>} - A Shopify cart
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
 * @param {Cart} cart - The cart object returned from Shopify
 * @returns {Cart} The same cart object
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
 * @returns {Promise<Cart>} - The Shopify cart after the PC flow has finished completely
 */
const handleAllNecessaryUpdates = reconciledCarts =>
  modifyShopifyCart(reconciledCarts)
    .then(cart => {
      if (DEBUG)
        console.debug(
          `cache.customerCartExpired? ${cache.customerCartExpired}, cart: `,
          cart
        );
      return cache.customerCartExpired ? updateDBCustomer(cart) : cart;
    })
    .then(finalCartUpdates);

/**
 * Determine whether to fetch a master Shopify cart (using the customer's cartID)
 * If needed, fetch and persist, otherwise, return the cart from page load
 * @returns {Promise<Cart>} - A Shopify cart
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
      if (DEBUG) console.debug(`🛒 cartToUseForUpdates: `, cart);
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
 * @param {Customer} customer - A customer retrieved from our DB
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
              ? `A customer was just created or updated: ' ${cache.customer.customerID}`
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
 * @param {Customer|null} customer - The customer value retrieved from the application DB (or null if no customer was yet in the DB)
 */
const initWithCustomer = customer => {
  if (DEBUG) console.debug('Persistent Cart 🛒 JS loaded');
  // Initialize logout handler for clearing storage and cart-related cookies on logout
  logoutHandlerInit();
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
 * @param {string} customerID
 */
const pcCheckInit = customerID => {
  /** @type HTMLInputElement */
  const cartCountEl = document.querySelector(CART_COUNT);
  /**
   * The value of currentCartCount may be "0" unless there are items in the
   * cart at the time of login. PC un-sets the cart cookie on logout, and it
   * will not be set again unless 1 or more items are added to the cart
   */
  cache.currentCartCount = parseInt(cartCountEl.value, 10);
  if (DEBUG)
    console.debug(
      `🛒 cache.currentCartCount on init: ${cache.currentCartCount}`
    );
  // Persist cid locally
  cache.customerID = customerID;
  // Test for a customer plus localStorage and cookie support (enabled), or do not proceed
  if (localStorageAvailable && cookiesAvailable) {
    if (cache.customerID) {
      getCustomer(cache.customerID)
        .then(customerResponse => {
          /**
           * Assuming
           * - The Storefront API was successfully queried and
           * - Either there's no customer in our DB yet or there is and Mongo
           *   did not return an error
           * Proceed
           */
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
          console.error('Persistent cart cannot be initialized', error);
          removeStoredShopifyCart();
        });
    } else {
      initWithoutCustomer();
    }
  }
};

/**
 * Cleanup actions to take on initialzation failures, depending on whether or
 * not a customer is logged in
 * @param {string} customerID
 */
const initCleanup = customerID => {
  if (customerID) {
    removeStoredShopifyCart();
  } else {
    initWithoutCustomer();
  }
};

/**
 * Initialize on DOM Content Loaded:
 * - Run a health-check request to the Shopify Storefront API, and attempt to
 *   persist this value to storage for future checks (with an expiration).
 *   Conditionally runs cleanup if `sessionStorage` is not available
 * - If that succeeds:
 *     - Initialize custom checkouts (auth and guest users, so
 *       with or without PC running)
 *     - Kick off the PC check and initialize flow (which will run PC for auth
 *       users, only, given other criteria are met)
 * - If the query to the Storefront API fails
 *     - Do not initialize custom checkouts
 *     - Run a cleanup initialization for PC (same operations as happen when a
 *       user logs out)
 */
document.addEventListener('DOMContentLoaded', async () => {
  // Get cid from template
  /** @type HTMLInputElement */
  const cidEl = document.querySelector(CUSTOMER_ID);
  const customerID = cidEl && cidEl.value ? cidEl.value : null;
  if (sessionStorageAvailable) {
    const storefrontAPIWorks = await persistedStorefrontAPITest();
    if (storefrontAPIWorks) {
      if (DEBUG) console.debug('Shopify 🏬 Storefront API test succeeded');
      // Initialize custom checkout for all customers: Favro DEC-3130
      customCheckoutInit();
      pcCheckInit(customerID);
    } else {
      console.error('Shopify 🏬 Storefront API test failed');
      initCleanup(customerID);
    }
  } else {
    console.error(`Session storage test failed, cannot persist Storefront API
    health check results`);
    initCleanup(customerID);
  }
});
