// @ts-check

/**
 * Product Tile Price
 *
 * This module handles DOM updates for the Product Tile price.
 */

import { JS_PREFIX } from './constants';
import { formatPriceRange, formatPriceSingle } from '../utilities/price-format';

const PRICE_CSS_SELECTOR = `.${JS_PREFIX}ProductTile-price`;
const CURRENT_PRICE_CSS_SELECTOR = `.${JS_PREFIX}ProductTile-currentPrice`;
const CROSSED_OUT_PRICE_CSS_SELECTOR = `.${JS_PREFIX}ProductTile-crossedOutPrice`;

/**
 * Helper to get all Current Price elements for a given Product Tile element
 *
 * @param {HTMLElement} productTileEl
 * @returns {NodeListOf<HTMLElement>}
 */
const getCurrentPriceElsForTile = productTileEl =>
  productTileEl.querySelectorAll(
    `${PRICE_CSS_SELECTOR} ${CURRENT_PRICE_CSS_SELECTOR}`
  );

/**
 * Helper to get all Crossed Out Price elements for a given Product Tile element
 *
 * @param {HTMLElement} productTileEl
 * @returns {NodeListOf<HTMLElement>}
 */
const getCrossedOutPriceElsForTile = productTileEl =>
  productTileEl.querySelectorAll(
    `${PRICE_CSS_SELECTOR} ${CROSSED_OUT_PRICE_CSS_SELECTOR}`
  );

/**
 * Formats the price for display
 *
 * @param {PriceData} state
 * @returns {string}
 */
const formatPrice = ({ prices, priceVaries }) => {
  if (priceVaries) {
    return formatPriceRange(prices);
  }

  if (!prices) {
    return '';
  }

  // If prices don't vary, all prices are the same
  // so go ahead and use the first one from the list.
  return formatPriceSingle(prices.split('|')[0]);
};

/**
 * @typedef {Object} PriceData
 * @property {string} [prices] The variant-level price values
 * @property {boolean} [priceVaries] product-level value
 * @property {string} [compareAtPrice]
 * @property {boolean} [compareAtPriceVaries]
 * @property {HTMLElement} productTileEl
 */

/**
 * Updates the Price UI
 *
 * @param {PriceData} priceData
 */
export const render = priceData => {
  const {
    priceVaries,
    compareAtPrice,
    compareAtPriceVaries,
    productTileEl
  } = priceData;

  getCurrentPriceElsForTile(productTileEl).forEach(currentPriceEl => {
    currentPriceEl.textContent = formatPrice(priceData);
  });

  getCrossedOutPriceElsForTile(productTileEl).forEach(crossedOutPriceEl => {
    // Crossed price exists only if the product has no price ranges
    // @see https://app.gitbook.com/@decathlonusa/s/shopify/product-feature/product-tiles-and-carousel#crossed-price
    if (!priceVaries && !compareAtPriceVaries && compareAtPrice) {
      crossedOutPriceEl.textContent = formatPriceSingle(compareAtPrice);
    }
  });
};
