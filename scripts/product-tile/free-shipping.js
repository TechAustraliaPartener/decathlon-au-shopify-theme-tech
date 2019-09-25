// @ts-check

import { JS_PREFIX, IS_HIDDEN_CLASS } from './constants';

/**
 * @typedef {Object} FreeShippingData
 * @property {boolean} [isFreeShipping] "Free Shipping" vs "Free shipping over $50"
 * @see https://app.gitbook.com/@decathlonusa/s/shopify/product-feature/product-tiles-and-carousel#delivery-options
 */

/**
 * Initializes scoped to a single Product Tile
 *
 * @param {HTMLElement} productTileEl
 */
export const init = productTileEl => {
  /** @type {HTMLElement} */
  const freeShippingOverFiftyEl = productTileEl.querySelector(
    `.${JS_PREFIX}DeliveryOptions-freeShippingOverFifty`
  );

  /**
   * Shows/hides the "over $50" free shipping element
   *
   * @param {FreeShippingData | undefined} freeShippingData
   */
  const updateFreeShipping = (freeShippingData = {}) => {
    const { isFreeShipping } = freeShippingData;
    if (freeShippingOverFiftyEl) {
      if (isFreeShipping) {
        freeShippingOverFiftyEl.classList.add(IS_HIDDEN_CLASS);
      } else {
        freeShippingOverFiftyEl.classList.remove(IS_HIDDEN_CLASS);
      }
    }
  };

  return {
    updateFreeShipping
  };
};
