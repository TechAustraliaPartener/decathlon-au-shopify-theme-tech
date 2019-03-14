import scriptsConfig from '../../shared/config';
import createCheckout from './queries';
import 'formdata-polyfill';
import '../../utilities/element-matches-polyfill';

const {
  SELECTORS: { CART, CHECKOUT_INPUT }
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
 * Hijack submissions of Shopify cart forms to create a custom checkout.
 * This allows multiple devices using persistent cart to reach checkout. For whatever reason,
 * while persistent cart is active, trying to checkout on more than one device
 * using the standard form submission kicks the user back to the cart page.
 * @param {Object} event - The Event passed into this handler, triggered by an event listener on the `submit` event
 */
const customCheckoutCartSubmitHandler = function(event) {
  event.preventDefault();
  event.stopPropagation();
  // Fetch a cart from Shopify
  fetch('/cart', {
    method: 'POST',
    body: new FormData(this)
  })
    .then(res => res.json())
    // Transform cart data to a format that will work as a payload for the Storefront GraphQL API
    .then(transformCartData)
    .then(makeGraphQLCheckoutPayload)
    .then(createCheckout)
    .then(res => {
      // If the createCheckout method returns a checkout webURL, set it as the new location
      if (res.checkout && res.checkout.webUrl) {
        window.location.assign(res.checkout.webUrl);
      }
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
const customCheckoutInit = () => {
  document.addEventListener('submit', function(e) {
    // Loop parent nodes from the target to the delegated node
    for (
      let target = e.target;
      target && target !== this;
      target = target.parentNode
    ) {
      if (
        // Ensure that we're delegating to the cart form and that the currentTarget.activeElement is not for checkout
        target.matches(CART) &&
        e.currentTarget.activeElement.matches(CHECKOUT_INPUT)
      ) {
        customCheckoutCartSubmitHandler.call(target, e);
        break;
      }
    }
  });
};

export default customCheckoutInit;
