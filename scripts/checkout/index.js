import { DELIVERY_METHODS } from './constants';
import STATE from './state';
import bindUI from './bind-ui';
import updateUI from './update-ui';
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

const selectFirstVisibleRate = () => {
  const radios = document.querySelectorAll('.radio-wrapper');
  const radiosArray = Array.prototype.slice.call(radios);
  const anyChecked = radiosArray.map(r => r.querySelector('input').checked).some(c => c === true);
  if (!anyChecked && radiosArray[0]) {
    radiosArray[0].querySelector('input').checked = true;
  }
}

if (step === 'shipping_method') {
  $(document).on('page:load page:change', () => {
    if (window.vars.cartTotalWeight > window.vars.freeShippingWeightLimit) {
      const freeStandardShippingElement = document
        .querySelector('[data-shipping-method="shopify-Free%20Standard%20Shipping-0.00"]');
      if (freeStandardShippingElement) {
        freeStandardShippingElement.parentNode.remove();
      } 
    }

    selectFirstVisibleRate();
  });
}