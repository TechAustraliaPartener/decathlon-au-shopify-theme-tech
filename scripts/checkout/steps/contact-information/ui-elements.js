import SELECTORS from './selectors';
import { elementExists } from '../../ui-helpers';

/**
 * Grouping all toggle elements together into an array for easier access
 */
export const deliveryElements = Object.keys(SELECTORS.DELIVERY_INPUTS).map(
  key => document.querySelector(SELECTORS.DELIVERY_INPUTS[key])
);

/**
 * Next step "continue" buttons
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
export const pickupLocationList = document.querySelector(
  SELECTORS.PICKUP_LOCATIONS
);
export const shippingAddressHeader = document.querySelector(
  SELECTORS.SHIPPING_ADDRESS_HEADER
);
export const userAddressList = elementExists(
  document.querySelector(SELECTORS.USER_ADDRESS_LIST)
)
  ? document.querySelector(SELECTORS.USER_ADDRESS_LIST).parentNode
  : false;
export const company = document.querySelector(SELECTORS.COMPANY);
export const userFirstName = document.querySelector(SELECTORS.USER_FIRST_NAME);
export const userLastName = document.querySelector(SELECTORS.USER_LAST_NAME);
export const userAddress1 = document.querySelector(SELECTORS.USER_ADDRESS_1);
export const userAddress2 = document.querySelector(SELECTORS.USER_ADDRESS_2);
export const userCity = document.querySelector(SELECTORS.USER_CITY);
export const userZip = document.querySelector(SELECTORS.USER_ZIP);
export const userPhone = document.querySelector(SELECTORS.USER_PHONE);
export const userEmail = document.querySelector(SELECTORS.USER_EMAIL);
export const mapImage = document.querySelector(SELECTORS.MAP_IMAGE);
export const loadingOverlay = document.querySelector(SELECTORS.LOADING_OVERLAY);
export const loadingImage = document.querySelector(SELECTORS.LOADING_IMAGE);
