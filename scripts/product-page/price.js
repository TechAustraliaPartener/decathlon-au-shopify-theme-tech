// @ts-check

/**
 * Price module
 *
 * Handles price formatting and UI update logic
 */

import { JS_PREFIX } from './constants';
import {
  variants,
  isProductPricingVaried,
  getVariantOptions
} from './product-data';
import { hideElement, showElement } from '../utilities/element-utils';

const CURRENT_PRICE_CSS_CLASS = `${JS_PREFIX}CurrentPrice`;
const CROSSED_OUT_PRICE_CSS_CLASS = `${JS_PREFIX}CrossedOutPrice`;
const PRICE_LABEL_CSS_CLASS = `${JS_PREFIX}PriceLabel`;
const PRICE_AMOUNT_LABEL_CSS_CLASS = `${JS_PREFIX}PriceAmount`;

// Multiple price elements exist in the DOM because there
// are different ones for smaller vs larger viewports, use `querySelectorAll`
/** @type {NodeListOf<HTMLElement>} */
const currentPriceEls = document.querySelectorAll(
  `.${CURRENT_PRICE_CSS_CLASS}`
);
/** @type {NodeListOf<HTMLElement>} */
const crossedOutPriceEls = document.querySelectorAll(
  `.${CROSSED_OUT_PRICE_CSS_CLASS}`
);

/**
 * Formats default Shopify price value, which is in cents,
 * to display format: $X.XX
 *
 * @param {number} price The price to format for display
 * @returns {string} A formatted price string (or blank string)
 */
const formatPrice = price => {
  if (price) {
    // @TODO Use 'utilities/price-format' utility functions
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
 * Gets all `compare_at_price` values for a given variant color
 *
 * @todo Consider using transducers if variants quantity is larger
 * @see: https://medium.com/javascript-scene/transducers-efficient-data-processing-pipelines-in-javascript-7985330fe73d
 *
 * @param {string} color A variant color
 * @returns {Array} An array of `compare_at_price` values
 */
const getCompareAtPricesByColor = color =>
  variants
    .filter(variant => getVariantOptions(variant).color === color)
    .map(variant => variant.compare_at_price);

/**
 * Helper to know if an HTML element is a crossed-out price element
 *
 * @param {HTMLElement} el
 * @returns {Boolean}
 */
const isCrossedOutPriceEl = el =>
  el.classList.contains(CROSSED_OUT_PRICE_CSS_CLASS);

/**
 * Helper that renders the price for a given set of HTML elements
 *
 * @param {Object} params
 * @param {NodeListOf<HTMLElement>} params.priceEls The price elements list
 * @param {string} [params.displayPrice=''] The price to render
 * @param {Boolean} [params.compareAtPrice=false] Should display as sale price?
 */
const render = ({ priceEls, displayPrice = '', compareAtPrice = false }) => {
  priceEls.forEach(priceEl => {
    /** @type {HTMLElement | null} */
    const labelEl = priceEl.querySelector(`.${PRICE_LABEL_CSS_CLASS}`);
    /** @type {HTMLElement | null} */
    const amountEl = priceEl.querySelector(`.${PRICE_AMOUNT_LABEL_CSS_CLASS}`);

    // Handle the "compare" (crossed-out) logic to show/hide
    if (isCrossedOutPriceEl(priceEl)) {
      if (compareAtPrice) {
        // Allow the crossed-out "original" price element to be visible
        showElement(priceEl);
      } else {
        // Hide the crossed-out "original" price element, not needed
        hideElement(priceEl);
      }
    }

    // Handle the current price label logic
    if (labelEl) {
      labelEl.textContent = compareAtPrice
        ? priceEl.dataset.salePriceLabel
        : priceEl.dataset.regularPriceLabel;
    }

    // Regardless of if current price or crossed-out price, update the display price
    if (amountEl) {
      amountEl.textContent = displayPrice;
    }
  });
};

/**
 * Handles updating the display prices when a variant is selected
 *
 * @param {Variant} variant
 */
const handleVariantSelection = ({
  price,
  compare_at_price: compareAtPrice
}) => {
  render({
    priceEls: currentPriceEls,
    displayPrice: formatPrice(price),
    compareAtPrice: compareAtPrice !== null
  });
  render({
    priceEls: crossedOutPriceEls,
    displayPrice: formatPrice(compareAtPrice),
    compareAtPrice: compareAtPrice !== null
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

  // Checks if at least one `compare_at_price` for all variants for the given `color` has
  // a value. If so, assume a "sale" price display by setting `compareAtPrice` to `true`.
  const isCompareAtPrice = getCompareAtPricesByColor(color).some(
    compareAtPrice => compareAtPrice !== null
  );

  render({
    priceEls: currentPriceEls,
    displayPrice: formatPriceRange({
      minPrice,
      maxPrice
    }),
    compareAtPrice: isCompareAtPrice
  });

  // Don't pass in a display price, defaults to empty string
  render({
    priceEls: crossedOutPriceEls
  });
};

/**
 * Updates the price display with price and sale price if necessary
 *
 * @param {object} obj The state data object
 * @param {string | undefined} obj.color Currently selector color
 * @param {Variant | undefined} obj.variant Currently selected variant
 */
export const onSwatchChange = ({ color, variant }) => {
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
