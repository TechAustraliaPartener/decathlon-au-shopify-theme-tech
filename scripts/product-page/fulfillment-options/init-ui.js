// @ts-check

/**
 * @typedef {Object} PickupOptionsEls
 * @property {HTMLElement} storeTileListEl - The store details blocks
 * for display in the drawer
 * @property {HTMLElement} userLocationCityEl - The element for displaying
 * the user's detected city
 * @property {HTMLElement} userLocationStateEl - The element for displaying
 * the user's detected state code (abbreviation)
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
 * @property {HTMLFormElement} locationForm - The form element that allows users to
 * search a location
 * @property {HTMLInputElement} locationFormInput - The form input element for users
 * to search a location
 * @property {HTMLElement} locationInputToggle - Toggle for opening the location
 * input in the drawer
 * @property {HTMLElement} useGeolocationEl - Affordance for the user to choose
 * to use geolocation
 * @property {HTMLElement} useMyLocationTextEl - Text for use geolocation
 * @property {HTMLElement} loadingLocationTextEl - Text to indicate loading
 * location data
 * @property {HTMLElement} customerLocationEl - Toggleable container for the
 * customer location input/form
 * @property {HTMLElement} thumbnailImageEl - Image element for displaying the
 * thumbnail of the currently selected product variant in the drawer
 * @property {HTMLElement} variantColorEl - Element for displaying currently
 * selected product color
 * @property {HTMLElement} variantSizeEl - Element for displaying currently
 * selected product size
 */

import {
  STORE_PICKUP_LIST_SELECTOR,
  STORE_PICKUP_USER_CITY_SELECTOR,
  STORE_PICKUP_USER_STATE_SELECTOR,
  STORE_PICKUP_ADDRESS,
  STORE_PICKUP_CITY,
  PICKUP_DAY,
  STORE_PICKUP_DETAILS,
  STORE_PICKUP_OPTIONS,
  SELECT_FOR_PICKUP_OPTIONS_MESSAGE,
  STORE_PICKUP_LOCATION_FORM,
  STORE_PICKUP_LOCATION_FORM_INPUT,
  STORE_PICKUP_LOCATION_INPUT_TOGGLE,
  STORE_PICKUP_USE_GEOLOCATION,
  STORE_PICKUP_USE_MY_LOCATION,
  STORE_PICKUP_LOADING_LOCATION,
  STORE_PICKUP_CUSTOMER_LOCATION,
  STORE_PICKUP_THUMBNAIL_IMAGE,
  STORE_PICKUP_VARIANT_COLOR,
  STORE_PICKUP_VARIANT_SIZE
} from './constants';

/**
 * Return an object with all DOM selectors needed for the  module to work
 * @returns {PickupOptionsEls} All elements for the module
 */
const initUI = () => ({
  storeTileListEl: document.querySelector(`.${STORE_PICKUP_LIST_SELECTOR}`),
  userLocationCityEl: document.querySelector(
    `.${STORE_PICKUP_USER_CITY_SELECTOR}`
  ),
  userLocationStateEl: document.querySelector(
    `.${STORE_PICKUP_USER_STATE_SELECTOR}`
  ),
  storeAddress1El: document.querySelector(`.${STORE_PICKUP_ADDRESS}`),
  storeCityEl: document.querySelector(`.${STORE_PICKUP_CITY}`),
  pickupDayEl: document.querySelector(`.${PICKUP_DAY}`),
  storePickupOptionsEl: document.querySelector(`.${STORE_PICKUP_OPTIONS}`),
  storePickupDetailsEl: document.querySelector(`.${STORE_PICKUP_DETAILS}`),
  selectForPickupOptionsMessageEl: document.querySelector(
    `.${SELECT_FOR_PICKUP_OPTIONS_MESSAGE}`
  ),
  locationForm: document.querySelector(`.${STORE_PICKUP_LOCATION_FORM}`),
  locationFormInput: document.querySelector(
    `.${STORE_PICKUP_LOCATION_FORM_INPUT}`
  ),
  locationInputToggle: document.querySelector(
    `.${STORE_PICKUP_LOCATION_INPUT_TOGGLE}`
  ),
  useGeolocationEl: document.querySelector(`.${STORE_PICKUP_USE_GEOLOCATION}`),
  useMyLocationTextEl: document.querySelector(
    `.${STORE_PICKUP_USE_MY_LOCATION}`
  ),
  loadingLocationTextEl: document.querySelector(
    `.${STORE_PICKUP_LOADING_LOCATION}`
  ),
  customerLocationEl: document.querySelector(
    `.${STORE_PICKUP_CUSTOMER_LOCATION}`
  ),
  thumbnailImageEl: document.querySelector(`.${STORE_PICKUP_THUMBNAIL_IMAGE}`),
  variantColorEl: document.querySelector(`.${STORE_PICKUP_VARIANT_COLOR}`),
  variantSizeEl: document.querySelector(`.${STORE_PICKUP_VARIANT_SIZE}`)
});

/**
 * Get and check the DOM elements needed for this module to work correctly.
 * Creates a closure around the queried elements object
 */
const verifyElements = () => {
  let pickupOptionsEls = initUI();
  for (const el in pickupOptionsEls) {
    if (!pickupOptionsEls[el]) {
      console.error(`Missing required element ${el}`);
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
