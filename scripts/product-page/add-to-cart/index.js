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
import { isVariantOutOfStock } from '../product-data';
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
import { isErrorScenario1 } from './error-scenarios';

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

/** @typedef {() => void} CallBack */
/** @type {CallBack[]} */
const variantModificationListeners = [];

/**
 * Subscribe to modifications to the global productJSON.variants
 * In this case the modifications are changes in variant quantities
 * @param {CallBack} cb
 */
export const onVariantModification = cb =>
  variantModificationListeners.push(cb);

const handleVariantModification = () => {
  variantModificationListeners.forEach(listener => listener());
};

/**
 * @todo Remove jQuery dependency, if possible
 */
$('body').on('addItemError.ajaxCart', function(e, { description }) {
  const currentVariant = state.getState().currentVariant;

  if (!description || !currentVariant) return;

  // Update the state with the proper error message/UI state
  state.updateState({
    ...DEFAULT_MODULE_STATE,
    ...getShopifyErrorUIState(description),
    currentVariant
  });

  if (isErrorScenario1(description)) {
    // Entirely sold out
    currentVariant.available = false;
    currentVariant.inventory_quantity = 0;
    handleVariantModification();
  }

  render(state.getState());
});

/**
 * The handler for when Add to Cart is clicked
 * @param {Event} event
 */
const onAddToCartClick = event => {
  const { currentVariant } = state.getState();

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

  // Reset the state to the default for that variant
  // (clears out ajax shopify error state)
  state.updateState(getUIState(currentVariant));
};

/**
 * To be called when a different variant is selected.
 * Resets the state, including resetting ajax error messages
 * @param {Variant} newVariant
 */
export const onVariantSelect = newVariant => {
  state.updateState({
    ...DEFAULT_MODULE_STATE,
    ...getUIState(newVariant),
    currentVariant: newVariant
  });
};

/**
 * Makes the DOM reflect the state
 * @param {ModuleState} state
 */
const render = ({
  isAddToCartButtonDisabled,
  validationText,
  addToCartButtonText
}) => {
  addToCartButtonEl.disabled = isAddToCartButtonDisabled;
  validationTextEl.textContent = validationText;
  addToCartButtonTextEl.textContent = addToCartButtonText;
};

state.onChange(render);

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
