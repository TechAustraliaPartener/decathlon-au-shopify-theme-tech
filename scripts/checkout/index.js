/* global Shopify */

import { DELIVERY_METHODS } from './constants';
import STATE from './state';
import bindUI from './bind-ui';
import updateUI from './update-ui';

/**
 * Intialize custom JS functionality
 */
const init = () => {
  // Set default delivery method
  STATE.deliveryMethod = DELIVERY_METHODS.SHIP;
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
