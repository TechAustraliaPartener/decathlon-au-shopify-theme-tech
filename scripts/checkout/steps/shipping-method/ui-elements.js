import SELECTORS from './selectors';
import { elementExists } from '../../../utilities/element-utils';

export const pickupShippingMethods = SELECTORS.PICKUP_SHIPPING_METHOD_BLOCKS.map(
  selector => {
    if (elementExists(document.querySelector(selector))) {
      return document.querySelector(selector).parentNode;
    }
    return false;
  }
);

export const pickupShippingMethod = document.querySelector(
  SELECTORS.PICKUP_SHIPPING_METHOD_BLOCK
);
