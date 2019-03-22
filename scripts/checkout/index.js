import { DELIVERY_METHODS } from './constants';
import STATE from './state';
import bindUI from './bind-ui';
import updateUI from './update-ui';
import { getObjectFromLocalStorage } from '../utilities/storage';

/**
 * Intialize custom JS functionality
 */
const init = () => {
  // Set delivery method - Default to ship, set pick if selection is stored. Needs to change to sessionStorage
  if (getObjectFromLocalStorage('delivery_method') === 'pickup') {
    STATE.deliveryMethod = DELIVERY_METHODS.PICKUP;
  } else {
    STATE.deliveryMethod = DELIVERY_METHODS.SHIP;
  }

  // Look for preferred store in storage and set global state. Needs to change to sessionStorage
  if (getObjectFromLocalStorage('pickup_store')) {
    STATE.pickupStore = getObjectFromLocalStorage('pickup_store');
  }

  // Set the current Shopify checkout step
  STATE.checkoutStep = window.Shopify && window.Shopify.Checkout && window.Shopify.Checkout.step;

  bindUI();
  updateUI();
};

/**
 * Listen to Shopify Checkout `page:load` to initialize
 * @see https://help.shopify.com/en/themes/development/layouts/checkout#page-events
 */
document.addEventListener('page:load', init);
