/* global Shopify */

import { DELIVERY_METHODS } from './constants';
import STATE from './state';
import bindUI from './bind-ui';
import updateUI from './update-ui';
import { getObjectFromLocalStorage } from '../utilities/storage';

/**
 * Intialize custom JS functionality
 */
const init = () => {
  // Set delivery method
  if (getObjectFromLocalStorage('delivery_method') === 'pickup') {
    STATE.deliveryMethod = DELIVERY_METHODS.PICKUP;
  } else {
    STATE.deliveryMethod = DELIVERY_METHODS.SHIP;
  }

  if (getObjectFromLocalStorage('pickup_store')) {
    STATE.pickupStore = getObjectFromLocalStorage('pickup_store');
  }

  // Set the current Shopify checkout step
  STATE.checkoutStep = Shopify && Shopify.Checkout && Shopify.Checkout.step;

  bindUI();
  updateUI();
};

/**
 * Listen to Shopify Checkout `page:load` to initialize
 * @see https://help.shopify.com/en/themes/development/layouts/checkout#page-events
 */
document.addEventListener('page:load', init);
