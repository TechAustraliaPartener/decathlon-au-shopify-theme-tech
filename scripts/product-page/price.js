// @ts-check

/**
 * Price module
 *
 * Handles price formatting and UI update logic
 */

import { PRICE_CLASS, COMPARE_PRICE_CLASS } from './constants';
import {
  variants,
  isProductPricingVaried,
  getVariantOptions
} from './product-data';

// Multiple price elements exist in the DOM because there
// are different ones for smaller vs larger viewports, use `querySelectorAll`
const productPriceEls = document.querySelectorAll(`.${PRICE_CLASS}`);
const compareAtPriceEls = document.querySelectorAll(`.${COMPARE_PRICE_CLASS}`);

/**
 * Formats default Shopify price value, which is in cents,
 * to display format: $X.XX
 *
 * @param {number} price The price to format for display
 * @returns {string} A formatted price string (or blank string)
 */
const formatPrice = price => {
  if (price) {
    return `$${(price / 100).toFixed(2)}`;
  }
  return '';
};

/**
 * Generates a formatted price, ranged if needed
 *
 * @param {Object} obj
 * @param {number} obj.minPrice
 * @param {number} obj.maxPrice
 * @returns {string} A formatted price to display
 */
const formatPriceRange = ({ minPrice, maxPrice }) =>
  minPrice === maxPrice
    ? // Show a single `price` when there is no range
      formatPrice(maxPrice)
    : // Show variants' `price` range
      `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`;

/**
 * Gets all prices for a given variant color
 *
 * @todo Consider using transducers if variants quantity is larger
 * @see: https://medium.com/javascript-scene/transducers-efficient-data-processing-pipelines-in-javascript-7985330fe73d
 *
 * @param {string} color A variant color
 * @returns {Array} An array of prices
 */
const getPricesByVariantColor = color =>
  variants
    .filter(variant => getVariantOptions(variant).color === color)
    .map(variant => variant.price);

/**
 * Helper that renders the price for a given set of HTML elements
 *
 * @param {Object} obj
 * @param {NodeList} obj.priceEls The price elements list
 * @param {string} obj.displayPrice The price to render
 */
const render = ({ priceEls, displayPrice }) => {
  priceEls.forEach(priceEl => {
    priceEl.textContent = displayPrice;
  });
};

/**
 * Handles updating the display prices when a variant is selected
 *
 * @param {Variant} variant
 */
const handleVariantSelection = variant => {
  const { price, compare_at_price: compareAtPrice } = variant;

  render({
    priceEls: productPriceEls,
    displayPrice: formatPrice(price)
  });
  render({
    priceEls: compareAtPriceEls,
    displayPrice: formatPrice(compareAtPrice)
  });
};

/**
 * Handles updating the display prices when a color is selected
 *
 * @see https://app.gitbook.com/@decathlonusa/s/shopify/product-feature/product-page#price
 * @param {string} color
 */
const handleColorSelection = color => {
  const prices = getPricesByVariantColor(color);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  render({
    priceEls: productPriceEls,
    displayPrice: formatPriceRange({
      minPrice,
      maxPrice
    })
  });
  // Render blank `compare_at_price` if only color is selected
  // @todo Should the element be hidden instead?
  render({
    priceEls: compareAtPriceEls,
    displayPrice: ''
  });
};

/**
 * Updates the price display with price and sale price if necessary
 *
 * @param {object} obj The state data object
 * @param {string} obj.color Currently selector color
 * @param {Variant} obj.variant Currently selected variant
 */
export const updateUI = ({ color, variant }) => {
  if (!isProductPricingVaried()) {
    // Do nothing if product variant prices do not vary.
    // Whatever is rendered from the server is the correct price
    // regardless of color/size selection.
    return;
  }

  // A completed variant (color + size) selection takes priority
  if (variant) {
    handleVariantSelection(variant);
    // No need to continue
    return;
  }

  handleColorSelection(color);
};
