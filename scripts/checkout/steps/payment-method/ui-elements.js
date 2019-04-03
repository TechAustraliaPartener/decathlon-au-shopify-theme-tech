import SELECTORS from './selectors';

export const billingAddressChoices = Object.keys(
  SELECTORS.BILLING_ADDRESS_CHOICES
).map(key => document.querySelector(SELECTORS.BILLING_ADDRESS_CHOICES[key]));

export const shipToLabel = document.querySelector(SELECTORS.SHIP_TO_LABEL);
export const shipToMap = document.querySelector(SELECTORS.SHIP_TO_MAP);
export const loadingOverlay = document.querySelector(SELECTORS.LOADING_OVERLAY);
export const loadingImage = document.querySelector(SELECTORS.LOADING_IMAGE);
