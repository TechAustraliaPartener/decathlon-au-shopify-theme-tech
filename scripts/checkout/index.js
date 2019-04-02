import { DELIVERY_METHODS } from './constants';
import STATE from './state';
import bindUI from './bind-ui';
import updateUI from './update-ui';
import { getObjectFromSessionStorage } from '../utilities/storage';
import '../utilities/foreach-polyfill';

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
