import { DELIVERY_METHODS } from './constants';
import STATE from './state';
import bindUI from './bind-ui';
import updateUI from './update-ui';
import { selectFirstVisibleRate } from './ui-helpers';
import { getObjectFromSessionStorage } from '../utilities/storage';

/**
 * Initialize custom JS functionality
 */
const init = () => {
  // Set delivery method - Default to ship, set pick if selection is stored.
  if (getObjectFromSessionStorage('delivery_method') === 'pickup') {
    STATE.deliveryMethod = DELIVERY_METHODS.PICKUP;
  } else {
    STATE.deliveryMethod = DELIVERY_METHODS.SHIP;
  }

  // Look for preferred store in sessionStorage and set global state.
  if (getObjectFromSessionStorage('pickup_store')) {
    STATE.pickupStore = getObjectFromSessionStorage('pickup_store');
  }

  // Bind event listeners (and more)
  bindUI();

  // Update UI elements, as needed
  updateUI();
};

/**
 * Listen to Shopify Checkout `page:load` to initialize
 * @see https://help.shopify.com/en/themes/development/layouts/checkout#page-events
 */
document.addEventListener('page:load', init);

// Separate JS
const step = Shopify?.Checkout?.step;

window.selectFirstVisibleRate = selectFirstVisibleRate;

const { cartTotal, cartTotalWeight, freeShippingPriceThreshold, freeShippingWeightLimit } = window?.vars || {};
console.log(cartTotal, freeShippingPriceThreshold);
console.log(cartTotalWeight, freeShippingWeightLimit);

if (step === 'shipping_method') {
  $(document).on('page:load page:change', () => {

    const standardShippingElement = document.querySelector('[data-shipping-method^="Shippit-shippit_standard_"],[data-shipping-method^="Shippit-shippit%7Cstandard%7C"]');

    const freeStandardShippingElement = document.querySelector('[data-shipping-method="shopify-Free%20Standard%20Shipping-0.00"]');

    const expressShippingElement = document.querySelector('[data-shipping-method^="Shippit-shippit_express_"],[data-shipping-method^="Shippit-shippit%7Cexpress%7C"]');

    if (cartTotalWeight > freeShippingWeightLimit) {
      if (freeStandardShippingElement) {
        freeStandardShippingElement.parentNode.remove();
      }
      if (expressShippingElement) {
        expressShippingElement.parentNode.remove();
      } 
    } else if (cartTotal >= freeShippingPriceThreshold) {
      if (standardShippingElement && freeStandardShippingElement) {
        standardShippingElement.parentNode.remove();
      }
    } else {
      if (standardShippingElement && freeStandardShippingElement) {
        freeStandardShippingElement.parentNode.remove();
      }
    }

    selectFirstVisibleRate();
  });
}
