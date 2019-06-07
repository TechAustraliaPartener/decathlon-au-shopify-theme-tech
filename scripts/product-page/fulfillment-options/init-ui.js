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
 * @returns {Object} All elements for the module
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
 * @returns {function} - Function that returns previously queried elements
 * or `null` if any were not found
 */
const verifyElements = () => {
  let pickupOptionsEls = initUI();
  for (const el in pickupOptionsEls) {
    if (!pickupOptionsEls[el]) {
      pickupOptionsEls = null;
    }
  }
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
