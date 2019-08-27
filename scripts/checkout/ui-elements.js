// @ts-check

import { LOADING_IMAGE_SELECTOR, LOADING_OVERLAY_SELECTOR } from './selectors';

export const loadingOverlay = /** @type {HTMLElement} */ (document.querySelector(
  LOADING_OVERLAY_SELECTOR
));
export const loadingImage = /** @type {HTMLElement} */ (document.querySelector(
  LOADING_IMAGE_SELECTOR
));
