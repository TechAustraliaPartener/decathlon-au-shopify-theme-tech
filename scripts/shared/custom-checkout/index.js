// @ts-check

import { DEBUG } from '../../shared/config';
import { IS_CUSTOM_CHECKOUT } from '../../shared/constants';
import { onCheckout, cartFormSubmitEl } from '../checkout-helpers';
import { createCheckout } from './queries';
import 'formdata-polyfill';

let removeCustomCheckoutCartSubmitHandler;

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
 * @param {Boolean} [shouldRetry] - Optional iterator for recursively re-running
 * @this {Element} - The cart or ajax-cart form
 */
export const customCheckoutCartSubmitHandler = function(
  event,
  shouldRetry = true
) {
  event.preventDefault();
  event.stopPropagation();
  /** @type {NodeListOf<HTMLInputElement>} */
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
       */
      window.location.assign(
        `${res.checkout.webUrl}&${encodeURIComponent(IS_CUSTOM_CHECKOUT)}=true`
      );
    })
    .catch(error => {
      console.error(error);
      if (DEBUG)
        console.debug(`Call to Shopify API failed in custom
        checkout handler. Will ${shouldRetry ? '' : 'not '}retry.`);
      /**
       * Attempts to retry custom checkout creation one time, throttled a bit
       * @see https://help.shopify.com/en/api/storefront-api/getting-started#storefront-api-rate-limits
       */
      if (shouldRetry) {
        setTimeout(
          () =>
            customCheckoutCartSubmitHandler.call(event.target, event, false),
          1000
        );
        return;
      }
      // Reload the page in order to try to resolve issues with the last payload
      /**
       * If getting a custom checkout fails, remove the handler that captures
       * the submit event. This will set up the next submit to attempt using
       * an online-store-generated checkout
       */
      removeCustomCheckoutCartSubmitHandler();
      /**
       * Programmatically proceed to checkout (requires a programmatic click)
       * @TODO - Evaluate any alternatives
       */
      if (cartFormSubmitEl) cartFormSubmitEl.click();
    });
};

/**
 * Initialize our custom checkout workaround for persistent cart.
 * Hijacks the standard cart form submission and runs a series of queries
 * to generate and transition to a new checkout URL.
 */
export const customCheckoutInit = () => {
  removeCustomCheckoutCartSubmitHandler = onCheckout(
    customCheckoutCartSubmitHandler
  );
  if (DEBUG) console.debug('💰 Custom checkout initialized');
};
