// @ts-check

// https://testing-decathlon-usa.myshopify.com/products/basketball-shoes-strong-500-low-inventory?
// /products/10-l-fast-hiking-backpack-helium?variant=12571110015048
// /collections/mens-running-shoes/products/mens-running-cushion-shoes?variant=12964007051336

/**
 * Add to cart module
 *
 * Updates Add to cart button state, title and validation message
 */
import { VALIDATION_MESSAGE_CLASS, JS_PREFIX } from '../constants';
import {
  getSelectedVariant,
  isVariantOutOfStock,
  getVariantOptions
} from '../product-data';
import { createState } from '../create-state';
import {
  getUIState,
  getShopifyErrorUIState,
  DEFAULT_UI_STATE
} from './ui-state';
import { handleAddToCartAttempt } from '../size-swatches';
/**
 * @todo Refactor to remove jQuery dependency
 */
import $ from 'jquery';

const MODULE_NAME = 'AddToCart';

/**
 * UI elements
 */

/**
 * @type {HTMLElement}
 */
const validationTextEl = document.querySelector(`.${VALIDATION_MESSAGE_CLASS}`);

/**
 * @type {HTMLButtonElement}
 */
const addToCartButtonEl = document.querySelector(
  `.${JS_PREFIX}${MODULE_NAME}-btn`
);

/**
 * @type {HTMLElement}
 */
const addToCartButtonTextEl = document.querySelector(
  `.${JS_PREFIX}${MODULE_NAME}-btn-text`
);

/**
 * Module Type Definitions
 */

/**
 * Type for the ATC module state
 *
 * @typedef {Object} ModuleState
 *
 * @property {string} module
 * @property {Variant} currentVariant
 * @property {string} addToCartButtonText
 * @property {string} validationText
 * @property {boolean} isAddToCartButtonDisabled
 * @property {boolean} isInAddToCartErrorState
 * @property {string | null} shopifyErrorMessage
 */

/**
 * @type {ModuleState}
 */
const DEFAULT_MODULE_STATE = {
  module: MODULE_NAME,
  currentVariant: null,
  ...DEFAULT_UI_STATE
};

// Create the module state
const state = createState(DEFAULT_MODULE_STATE);

/**
 * Helper to type the `state.getState()` return as a `ModuleState` type
 *
 * @todo Refactor to remove wrapper function
 * @see  https://github.com/decathlon-usa/shopify-theme-decathlonusa/pull/400#discussion_r296424124
 * @returns {ModuleState}
 */
const getModuleState = () => state.getState();

/**
 * Helper to type the `newState` param as a `ModuleState` type
 *
 * @todo Refactor to remove wrapper function
 * @see  https://github.com/decathlon-usa/shopify-theme-decathlonusa/pull/400#discussion_r296424124
 * @param {ModuleState} newState
 */
const setModuleState = newState => state.updateState(newState);

/**
 * @todo Remove jQuery dependency, if possible
 */
$('body').on('addItemError.ajaxCart', function(e, { description }) {
  const currentVariant = getModuleState().currentVariant;

  if (!description || !currentVariant) {
    return;
  }

  // Update the state with the proper error message/UI state
  setModuleState({
    ...DEFAULT_MODULE_STATE,
    ...getShopifyErrorUIState(description),
    currentVariant
  });

  updateUI(getVariantOptions(currentVariant));
});

/**
 * The handler for when Add to Cart is clicked
 * @param {Event} event
 */
const onAddToCartClick = event => {
  const { currentVariant } = getModuleState();

  if (!currentVariant) {
    // Prevent Add To Cart form submit from going through
    event.preventDefault();
    handleAddToCartAttempt();
    return;
  }

  if (isVariantOutOfStock(currentVariant)) {
    if (window.BISPopover) {
      window.BISPopover.show();
    }
  }

  // We need to update the UI anytime the ATC button is clicked
  updateUI(getVariantOptions(currentVariant));
};

/**
 * Updates the Add To Cart UI
 *
 * Updates the ATC button and validation (error) messages.
 * Depends on the current size/color combination.
 * Will be triggered if size or color changes.
 * Will also be called when a user clicks the ATC button.
 *
 * @todo Consider a refactor to take in a `Variant` as the argument.
 * This would apply to all UI modules + the `product-page/index` module
 * @see https://github.com/decathlon-usa/shopify-theme-decathlonusa/pull/400#discussion_r296427385
 *
 * @todo Is `updateUI()` being called too many times unnecessarily?
 * @see https://testing-decathlon-usa.myshopify.com/products/10-l-fast-hiking-backpack-helium?variant=12571110015048
 *
 * @param {object} obj The state data object
 * @param {string} obj.size Value of the selected size option
 * @param {string} obj.color Value of the selected color option
 */
export const updateUI = ({ size, color }) => {
  const currentVariant = getSelectedVariant({ size, color });
  const { isInAddToCartErrorState } = getModuleState();

  // Only update state if the ATC is not an AJAX error state.
  // When in an ATC AJAX error state, allow UI to reflect the error state.
  if (!isInAddToCartErrorState) {
    setModuleState({
      ...DEFAULT_MODULE_STATE,
      ...getUIState(currentVariant),
      currentVariant
    });
  }

  const {
    isAddToCartButtonDisabled,
    validationText,
    addToCartButtonText
  } = getModuleState();

  // Update the ATC UI visual state based off module state
  addToCartButtonEl.disabled = isAddToCartButtonDisabled;
  validationTextEl.textContent = validationText;
  addToCartButtonTextEl.textContent = addToCartButtonText;

  // Finally reset the error states
  setModuleState({
    ...DEFAULT_MODULE_STATE,
    currentVariant
  });
};

/**
 * Initialize the ATC UI
 */
export const init = () => {
  /**
   * Listener for Add to Cart button
   */
  if (addToCartButtonEl) {
    addToCartButtonEl.addEventListener('click', onAddToCartClick);
  }
};
