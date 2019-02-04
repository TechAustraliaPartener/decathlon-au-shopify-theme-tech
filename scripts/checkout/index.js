/* global Shopify */

import { DELIVERY_METHODS } from './constants';
import STATE from './state';
import { querySelector, showElements, hideElements } from './utils';

/**
 * The toggle buttons
 */
const shipToggleBtn = querySelector('.js-toggle-shipping');
const pickupToggleBtn = querySelector('.js-toggle-pickup');

/**
 * Note: If Shopify updates the `content_for_layout` Liquid drop,
 * there is the possiblity the selectors will fail. This is a known
 * risk we are taking.
 * @see https://help.shopify.com/en/themes/development/layouts/checkout/best-practices#dom-dependency-and-liquid-drops
 * @see https://docs.decathlon.us/shopify/-LSqQDiLEYzw_Jv4oueW/product-feature/untitled-2#shopify-plus-checkout-customization
 */
const toggleElementSelectors = {
  addressInput: '[data-address-field="address1"]',
  cityInput: '[data-address-field="city"]',
  countryInput: '[data-address-field="country"]',
  provinceInput: '[data-address-field="province"]',
  zipInput: '[data-address-field="zip"]'
};

/**
 * Grouping all toggle elements together into an array for easier access
 */
const toggleElements = Object.keys(toggleElementSelectors).map(
  key => querySelector(toggleElementSelectors[key])
);

/**
 * Bind the toggle buttons
 */
pickupToggleBtn.addEventListener('click', event => {
  STATE.deliveryMethod = DELIVERY_METHODS.PICKUP;
  hideElements(toggleElements);
});

shipToggleBtn.addEventListener('click', event => {
  STATE.deliveryMethod = DELIVERY_METHODS.SHIP;
  showElements(toggleElements);
});

/**
 * Intialize the UI
 * Without JS, the Ship/Pickup toggle buttons won't display.
 */
const uiInit = () => {
  // Set default delivery method
  STATE.deliveryMethod = DELIVERY_METHODS.SHIP;
  // Set the current Shopify checkout step
  STATE.checkoutStep = Shopify && Shopify.Checkout && Shopify.Checkout.step;

  showElements([shipToggleBtn, pickupToggleBtn]);
};

/**
 * Listen to Shopify Checkout `page:load` to initialize
 * @see https://help.shopify.com/en/themes/development/layouts/checkout#page-events
 */
document.addEventListener('page:load', uiInit);
