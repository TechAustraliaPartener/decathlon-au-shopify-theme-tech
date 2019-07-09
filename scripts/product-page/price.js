/**
 * Price module
 *
 * Gets price information for the selected variant and updates UI.
 */

import { PRICE_CLASS, COMPARE_PRICE_CLASS } from './constants';
import { getSelectedVariant } from './product-data';
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
 * @param {string} obj.size Value of the selected size option
 * @param {string} obj.color Value of the selected color option
 */
export const updateUI = ({ size, color }) => {
  const selectedVariant = getSelectedVariant({ size, color });

  // Update Price
  $ProductPrice.text(formatPrice(selectedVariant.price));

  // Update Compare Price
  if (selectedVariant.compare_at_price === null) {
    $ComparePrice.text('');
  } else {
    $ComparePrice.text(formatPrice(selectedVariant.compare_at_price));
  }
};
