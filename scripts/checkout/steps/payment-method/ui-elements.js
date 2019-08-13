// @ts-check

import SELECTORS from './selectors';

export const billingAddressChoices = Object.keys(
  SELECTORS.BILLING_ADDRESS_CHOICES
).map(key => document.querySelector(SELECTORS.BILLING_ADDRESS_CHOICES[key]));

export const shipToLabel = document.querySelector(SELECTORS.SHIP_TO_LABEL);
export const shipToMap = document.querySelector(SELECTORS.SHIP_TO_MAP);
export const loadingOverlay = document.querySelector(SELECTORS.LOADING_OVERLAY);
export const loadingImage = document.querySelector(SELECTORS.LOADING_IMAGE);
/** @type {HTMLInputElement} */
export const userAddress1 = document.querySelector(SELECTORS.USER_ADDRESS_1);
/** @type {HTMLInputElement} */
export const userAddress2 = document.querySelector(SELECTORS.USER_ADDRESS_2);
/** @type {HTMLInputElement} */
export const userCity = document.querySelector(SELECTORS.USER_CITY);
/** @type {HTMLInputElement} */
export const userZip = document.querySelector(SELECTORS.USER_ZIP);
