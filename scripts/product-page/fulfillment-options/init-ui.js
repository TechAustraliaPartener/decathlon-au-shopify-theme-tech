// @ts-check

/**
 * @typedef {Object} PickupOptionsEls
 * @property {HTMLElement} storeTileListEl - The store details blocks
 * for display in the drawer
 * @property {HTMLElement} userLocationZipcodeEl - The element for displaying the user's
 * detected Zip Code
 * @property {HTMLElement} storeAddress1El -The element for a store
 * address
 * @property {HTMLElement} storeCityEl - The element for a store city
 * @property {HTMLElement} pickupDayEl - The element for showing
 * next available pickup day
 * @property {HTMLElement} storePickupOptionsEl - The element that
 * contains all pickup options
 * @property {HTMLElement} storePickupDetailsEl - The element that
 * shows store details
 * @property {HTMLElement} selectForPickupOptionsMessageEl - The
 * element that contains the prompt to select product options before showing
 * pickup options
 */

import {
  STORE_PICKUP_LIST_SELECTOR,
  STORE_PICKUP_ZIPCODE_SELECTOR,
  STORE_PICKUP_ADDRESS,
  STORE_PICKUP_CITY,
  PICKUP_DAY,
  STORE_PICKUP_DETAILS,
  STORE_PICKUP_OPTIONS,
  SELECT_FOR_PICKUP_OPTIONS_MESSAGE
} from './constants';

/**
 * Return an object with all DOM selectors needed for the  module to work
 * @returns {PickupOptionsEls} All elements for the module
 */
const initUI = () => ({
  storeTileListEl: document.getElementById(STORE_PICKUP_LIST_SELECTOR),
  userLocationZipcodeEl: document.getElementById(STORE_PICKUP_ZIPCODE_SELECTOR),
  storeAddress1El: document.querySelector(`.${STORE_PICKUP_ADDRESS}`),
  storeCityEl: document.querySelector(`.${STORE_PICKUP_CITY}`),
  pickupDayEl: document.querySelector(`.${PICKUP_DAY}`),
  storePickupOptionsEl: document.querySelector(`.${STORE_PICKUP_OPTIONS}`),
  storePickupDetailsEl: document.querySelector(`.${STORE_PICKUP_DETAILS}`),
  selectForPickupOptionsMessageEl: document.querySelector(
    `.${SELECT_FOR_PICKUP_OPTIONS_MESSAGE}`
  )
});

/**
 * Get and check the DOM elements needed for this module to work correctly.
 * Creates a closure around the queried elements object
 */
const verifyElements = () => {
  let pickupOptionsEls = initUI();
  for (const el in pickupOptionsEls) {
    if (!pickupOptionsEls[el]) {
      pickupOptionsEls = null;
      break;
    }
  }
  /**
   * Function that returns previously queried elements or null if a required
   * element was not found
   * @returns {PickupOptionsEls | null}
   */
  return () => {
    return pickupOptionsEls;
  };
};

/**
 * Get the DOM elements needed for this module to work correctly
 * @returns {Object | null} - An object of required DOM elements to act on or
 * null if any one of the queried selectors did not return an element
 */
export const getUIElements = verifyElements();
