/**
 * Price module
 *
 * Gets price information for the selected variant and updates UI.
 */

import { PRICE_CLASS, COMPARE_PRICE_CLASS } from './constants';
import $ from 'jquery';
/**
 * @todo Refactor to remove jQuery dependency
 */
const $ProductPrice = $(`.${PRICE_CLASS}`);
const $ComparePrice = $(`.${COMPARE_PRICE_CLASS}`);

/**
 * Formats default Shopify price value, which is in cents,
 * to display format: $X.XX
 *
 * @param {string} price The price to format for display
 * @returns {string} A formatted price string
 */
const formatPrice = price => `$${(price / 100).toFixed(2)}`;

/**
 * Updates the price display with price and sale price if necessary
 *
 * @param {object} obj The state data object
 * @param {Variant} obj.variant The selected variant
 */
export const updateUI = ({ variant }) => {
  // Update Price
  $ProductPrice.text(formatPrice(variant.price));

  // Update Compare Price
  if (variant.compare_at_price === null) {
    $ComparePrice.text('');
  } else {
    $ComparePrice.text(formatPrice(variant.compare_at_price));
  }
};
