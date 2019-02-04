import SELECTORS from './selectors';

/**
 * Grouping all toggle elements together into an array for easier access
 */
export const deliveryElements = Object.keys(SELECTORS.DELIVERY_INPUTS).map(
  key => document.querySelector(SELECTORS.DELIVERY_INPUTS[key])
);

/**
 * Next step "continue" button
 */
export const continueBtn = document.querySelector(SELECTORS.CONTINUE_BTN);

/**
 * The toggle buttons
 */
export const shipToggleBtn = document.querySelector(SELECTORS.TOGGLE_SHIPPING);
export const pickupToggleBtn = document.querySelector(SELECTORS.TOGGLE_PICKUP);

/**
 * Content specific to the "Pickup" UI
 */
export const pickupContent = document.querySelector(SELECTORS.PICKUP_CONTENT);
export const storeLocations = document.querySelectorAll(SELECTORS.STORE_INPUT);
