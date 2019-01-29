import {
  querySelector,
  showElements,
  hideElements
} from './utils';

/**
 * The toggle buttons
 */
const shipToggleBtn = querySelector('.js-ship-toggle-btn');
const pickupToggleBtn = querySelector('.js-pickup-toggle-btn');

/**
 * Input fields of interest
 * Note: If Shopify updates the `content_for_layout` Liquid drop,
 * there is the possiblity the selectors will fail. This is a known
 * risk we are taking.
 * @see https://help.shopify.com/en/themes/development/layouts/checkout/best-practices#dom-dependency-and-liquid-drops
 */
const addressInput = querySelector('[data-address-field="address1"');
const cityInput = querySelector('[data-address-field="city"]');
const countryInput = querySelector('[data-address-field="country"]');
const provinceInput = querySelector('[data-address-field="province"]');
const zipInput = querySelector('[data-address-field="zip"]');

/**
 * Grouping all toggle elements together for easier access
 */
const toggleElements = [
  addressInput,
  cityInput,
  countryInput,
  provinceInput,
  zipInput
];

/**
 * Bind the toggle buttons
 */
pickupToggleBtn.addEventListener('click', event => {
  hideElements(toggleElements);
});

shipToggleBtn.addEventListener('click', event => {
  showElements(toggleElements);
});

/**
 * Intialize the UI
 * Without JS, the Ship/Pickup toggle buttons won't display.
 */
const uiInit = () => {
  showElements([
    shipToggleBtn,
    pickupToggleBtn
  ]);
};

document.addEventListener('DOMContentLoaded', uiInit);
