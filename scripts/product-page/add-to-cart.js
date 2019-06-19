// @ts-check

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
import {
  getSelectedVariant,
  isEndOfLifeProduct,
  isVariantOutOfStock,
  isVariantSoldOut
} from './product-data';
import $ from 'jquery';
/**
 * @todo Refactor to remove jQuery dependency
 */
const MIN_QUANTITY_THRESHOLD = 5;
const $ValidationMessage = $(`.${VALIDATION_MESSAGE_CLASS}`);
const ADD_TO_CART_BTN_SELECTOR = `.${ADD_TO_CART_CLASS}-btn`;
const ADD_TO_CART_TEXT_SELECTOR = `.${ADD_TO_CART_CLASS}-text`;
const $AddToCartButtonText = $(ADD_TO_CART_TEXT_SELECTOR);
const addToCartButton = document.querySelector(ADD_TO_CART_BTN_SELECTOR);
const availabilityState = {
  message: '',
  atcCopy: PRODUCT_PAGE_COPY.ATC_AVAILABLE
};

let currentVariant = null;

export const init = () => {
  /**
   * Depending on "End Of Life" state, specifies the UI
   * unavailable "sold out" or "out of stock" text
   */
  if (isEndOfLifeProduct()) {
    availabilityState.message = PRODUCT_PAGE_COPY.VALIDATION_SOLD_OUT;
    availabilityState.atcCopy = PRODUCT_PAGE_COPY.ATC_SOLD_OUT;
  } else {
    availabilityState.message = PRODUCT_PAGE_COPY.VALIDATION_OUT_OF_STOCK;
    availabilityState.atcCopy = PRODUCT_PAGE_COPY.ATC_OUT_OF_STOCK;
  }

  /**
   * Listener for Add to Cart button
   */
  if (addToCartButton) {
    addToCartButton.addEventListener('click', onAddToCartClick);
  }
};

/**
 * The handler for when Add to Cart is clicked
 */
const onAddToCartClick = () => {
  if (isVariantOutOfStock(currentVariant)) {
    if (window.BISPopover) {
      window.BISPopover.show();
    }
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
  Number(quantity) > MIN_QUANTITY_THRESHOLD ? '' : `Only ${quantity} left`;

/**
 * Returns validation text for Add to Cart button based on variant availability
 *
 * @param {Object} variant A product variant object
 * @returns {string} Text for Add to Cart validation block
 */
const getValidationText = variant =>
  variant.available ? getQuantityLeftText(variant) : availabilityState.message;

/**
 * Returns text for Add to Cart button based on variant availability
 *
 * @param {Object} variant A product variant object
 * @param {boolean} variant.available
 * @returns {string} Text to add to Add to Cart button
 */
const getAddToCartButtonText = ({ available }) =>
  available ? PRODUCT_PAGE_COPY.ATC_AVAILABLE : availabilityState.atcCopy;

/**
 * Updates the `disabled` state for a given element
 * @param {Object} obj
 * @param {Element} obj.el The HTML element to set/remove the `disabled` attr upon
 * @param {boolean} obj.isDisabled The disabled state to set for the given element
 */
const setElDisabledState = ({ el, isDisabled }) => {
  if (el) {
    if (isDisabled) {
      el.setAttribute('disabled', '');
    } else {
      el.removeAttribute('disabled');
    }
  }
};

/**
 * Enables/disables and updates Add to Cart button with label and validation text
 * with correct states for currently selected variant.
 *
 * @param {object} obj The state data object
 * @param {string} obj.size Value of the selected size option
 * @param {string} obj.color Value of the selected color option
 */
export const updateUI = ({ size, color }) => {
  currentVariant = getSelectedVariant({ size, color });

  setElDisabledState({
    el: addToCartButton,
    isDisabled: isVariantSoldOut(currentVariant)
  });

  $ValidationMessage.text(getValidationText(currentVariant));
  $AddToCartButtonText.text(getAddToCartButtonText(currentVariant));
};
