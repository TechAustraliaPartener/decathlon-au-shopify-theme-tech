// @ts-check

import scriptsConfig, { DEBUG } from '../../shared/config';
import { IS_CUSTOM_CHECKOUT } from '../../shared/constants';
import { createCheckout } from './queries';
import 'formdata-polyfill';

const {
  SELECTORS: { CART }
} = scriptsConfig;

/**
 * Build a payload object of cart items for creating a checkout
 * @param {Object} cartData - A Shopify cart fetched from the `/cart.js` endpoint
 * @returns {Object[]} - Line item cart data in the format needed to create a checkout
 */
const transformCartData = cartData => {
  return cartData.items.map(item => ({
    quantity: item.quantity,
    variantId: btoa(`gid://shopify/ProductVariant/${item.variant_id}`)
  }));
};

/**
 * Add items to an object for the GraphQL query
 * @param {Object[]} items - Line items in the format needed to pass to the GraphQL Storefront API
 * @returns {Object} - An object with items as the property `lineItems` in a new object
 */
const makeGraphQLCheckoutPayload = items => ({ lineItems: items });

/**
 * Check a fetch response and throw if needed
 * @param {Object} response - A fetch response object
 * @returns {Object} - The same response
 * @throws {Object} - An error object containing the response's statusText
 */
const handleFetchError = response => {
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response;
};

/**
 * Hijack submissions of Shopify cart forms to create a custom checkout.
 * This allows multiple devices using persistent cart to reach checkout. For whatever reason,
 * while persistent cart is active, trying to checkout on more than one device
 * using the standard form submission kicks the user back to the cart page.
 * @param {Object} event - The Event passed into this handler, triggered by an event listener on the `submit` event
 */
const customCheckoutCartSubmitHandler = function(event) {
  event.preventDefault();
  event.stopPropagation();
  const updateInputs = this.querySelectorAll('[name="updates[]"]');
  // Create an array from the updates inputs
  const inputsArr = [...updateInputs];
  // Filter out inputs whose value is 0
  const filteredInputs = inputsArr.filter(
    input => parseInt(input.value, 10) > 0
  );
  // If all inputs are set to 0, just abandon the handler and reload the page to refresh with no cart
  if (filteredInputs.length === 0) {
    window.location.reload();
    return false;
  }
  // Create a new form from inputs with quantity greater than 0
  const postForm = document.createElement('form');
  filteredInputs.forEach(input => postForm.appendChild(input.cloneNode()));
  // Fetch a cart from Shopify
  fetch('/cart', {
    method: 'POST',
    body: new FormData(postForm)
  })
    .then(handleFetchError)
    .then(res => res.json())
    // Transform cart data to a format that will work as a payload for the Storefront GraphQL API
    .then(transformCartData)
    .then(makeGraphQLCheckoutPayload)
    .then(createCheckout)
    .then(res => {
      if (DEBUG)
        console.debug(
          'Response when creating custom checkout 🛒',
          JSON.stringify(res)
        );
      /**
       * Combine error messages and throw error if there's no checkout with a
       * `webURL` at this point
       */
      if (!res.checkout || !res.checkout.webUrl) {
        const errors = res.checkoutUserErrors;
        const messages = errors
          ? errors.reduce((acc, curr) => `${acc}, ${curr.message}`, '')
          : '';
        throw new Error(
          `Error attempting to create custom checkout 🛒. ${messages}`
        );
      }
      /**
       * If the createCheckout method returns a checkout webURL, set it as the
       * new location, and add a query-string flag to indicate that it was
       * created using the Storefront API (for any checks within the checkout
       * flow).
       * @TODO - Decide whether the actual checkout id should be passed in some
       * way. Is it a risk to pass in the URL? Is it needed (it would be needed
       * to query the Storefront API again and verify a URL match within checkout)
       */
      window.location.assign(
        `${res.checkout.webUrl}&${encodeURIComponent(IS_CUSTOM_CHECKOUT)}=true`
      );
    })
    .catch(error => {
      console.error(error);
      // Reload the page in order to try to resolve issues with the last payload
      /**
       * @TODO - Look at rebuilding the cart here (and/or automatic retries).
       * Rebuilding would involve using the methods in PC to hydrate a new cart
       * (with a different token)
       */
      window.location.reload();
    });
};

/**
 * Initialize our custom checkout workaround for persistent cart.
 * Hijacks the standard cart form submission and runs a series of queries
 * to generate and transition to a new checkout URL.
 * Delegate submit event handling from any cart form to the document,
 * which is listening for all submit events.
 * In this way, the AJAX add-to-cart checkout form submit will be handled
 * even though it is not in the DOM on page load
 */
export const customCheckoutInit = () => {
  document.addEventListener('submit', function(e) {
    // Loop parent nodes from the target to the delegated node
    for (
      let target = e.target;
      target && target !== this;
      /**
       * @todo Resolve TSLint issues
       * TSLint problems here. Attempted to cast event.target to HTMLElement,
       * but further issues with comparing current element to Document, so
       * adding ts-ignore to lines in this function, which is known to work
       */
      // @ts-ignore
      target = target.parentNode
    ) {
      // @ts-ignore
      if (target.matches(CART)) {
        customCheckoutCartSubmitHandler.call(target, e);
        break;
      }
    }
  });
  if (DEBUG) console.debug('💰 Custom checkout initialized');
};
