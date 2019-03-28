import SELECTORS from './selectors';
import { elementExists } from '../../ui-helpers';

export const pickupShippingMethods = SELECTORS.PICKUP_SHIPPING_METHOD_BLOCKS.map(
  selector => {
    if (elementExists(document.querySelector(selector))) {
      return document.querySelector(selector).parentNode;
    }
    return false;
  }
);

export const loadingOverlay = document.querySelector(SELECTORS.LOADING_OVERLAY);
export const loadingImage = document.querySelector(SELECTORS.LOADING_IMAGE);
