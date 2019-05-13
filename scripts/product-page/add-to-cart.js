/**
 * Add to cart module
 *
 * Updates Add to cart button state, title and validation message
 */
import {
  VALIDATION_MESSAGE_CLASS,
  ADD_TO_CART_CLASS,
  PRODUCT_PAGE_COPY
} from './constants';
import { getSelectedVariant, isSoldOut } from './product-data';
import $ from 'jquery';
/**
 * @todo Refactor to remove jQuery dependency
 */
const MIN_QUANTITY_THRESHOLD = 5;
const $ValidationMessage = $(`.${VALIDATION_MESSAGE_CLASS}`);
const ADD_TO_CART_BTN_SELECTOR = `.${ADD_TO_CART_CLASS}-btn`;
const ADD_TO_CART_TEXT_SELECTOR = `.${ADD_TO_CART_CLASS}-text`;
const $AddToCartButton = $(ADD_TO_CART_BTN_SELECTOR);
const $AddToCartButtonText = $(ADD_TO_CART_TEXT_SELECTOR);
const unvailableStatus = {};

/**
 * Check product attributes for the "End of Life" tag and specifies whether the
 * unavailable state is "sold out" or "out of stock."
 */

export const init = () => {
  if (isSoldOut()) {
    unvailableStatus.message = PRODUCT_PAGE_COPY.VALIDATION_SOLD_OUT;
    unvailableStatus.atcCopy = PRODUCT_PAGE_COPY.ATC_SOLD_OUT;
  } else {
    unvailableStatus.message = PRODUCT_PAGE_COPY.VALIDATION_OUT_OF_STOCK;
    unvailableStatus.atcCopy = PRODUCT_PAGE_COPY.ATC_OUT_OF_STOCK;
  }
};

/**
 * Returns validation text based on quantity left in inventory
 *
 * @param {object} variant Current selected variant
 * @param {string} variant.inventory_quantity Inventory count for current selected variant
 * @returns {string} Validation text for inventory qty under threshold or empty string
 *
 * @todo make "MIN_QUANTITY_THRESHOLD" threshold dynamic based on theme settings
 */
const getQuantityLeftText = ({ inventory_quantity: quantity }) =>
  quantity > MIN_QUANTITY_THRESHOLD ? '' : `Only ${quantity} left`;

/**
 * Returns validation text for Add to Cart button based on variant availability
 *
 * @param {Object} variant A product variant object
 * @returns {string} Text for Add to Cart validation block
 */
const getValidationText = variant =>
  variant.available ? getQuantityLeftText(variant) : unvailableStatus.message;

/**
 * Returns text for Add to Cart button based on variant availability
 *
 * @param {Object} variant A product variant object
 * @param {boolean} variant.available
 * @returns {string} Text to add to Add to Cart button
 */
const getAddToCartButtonText = ({ available }) =>
  available ? PRODUCT_PAGE_COPY.ATC_AVAILABLE : unvailableStatus.atcCopy;

/**
 * Enables/disables and updates Add to Cart button with label and validation text
 * with correct states for currently selected variant.
 *
 *
 * @param {object} obj The state data object
 * @param {string} obj.size Value of the selected size option
 * @param {string} obj.color Value of the selected color option
 */
export const updateUI = ({ size, color }) => {
  const selectedVariant = getSelectedVariant({ size, color });

  $AddToCartButton.attr('disabled', !selectedVariant.available);
  $ValidationMessage.text(getValidationText(selectedVariant));
  $AddToCartButtonText.text(getAddToCartButtonText(selectedVariant));
};
