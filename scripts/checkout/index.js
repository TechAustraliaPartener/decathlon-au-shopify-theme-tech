// @ts-check

import { getIsOnlineStoreCheckout } from './utilities';
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
 * Check if this is a fallback, online store checkout (not a custom checkout
 * created using the Storefront API - necessary for both PC and Shipping vs Pickup
 * customizations). Condition initialization actions accordingly.
 * Also, evaluate the type of event. Only handle changes in an online store
 * checkout if it's a page load event
 */
const initCheck = () => {
  const isOnlineStoreCheckout = getIsOnlineStoreCheckout();
  if (isOnlineStoreCheckout) {
    updateUI({ isOnlineStoreCheckout });
  } else {
    init();
  }
};

/**
 * Listen to Shopify Checkout `page:load` to initialize
 * @see https://help.shopify.com/en/themes/development/layouts/checkout#page-events
 */
document.addEventListener('page:load', initCheck);
