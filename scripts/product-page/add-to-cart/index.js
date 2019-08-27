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
  getQuantityFromMessage,
  DEFAULT_UI_STATE
} from './ui-state';
import { handleAddToCartAttemptWithNoVariant } from '../size-swatches';
/**
 * @todo Refactor to remove jQuery dependency
 */
import $ from 'jquery';
import { isErrorScenario1, isErrorScenario2 } from './error-scenarios';

const MODULE_NAME = 'AddToCart';
const ADD_TO_CART_PREFIX = `.${JS_PREFIX}${MODULE_NAME}-`;

/**
 * UI elements
 */

/** @type {HTMLInputElement} */
const quantityInputEl = document.querySelector(`${ADD_TO_CART_PREFIX}quantity`);

/** @type {HTMLElement} */
const validationTextEl = document.querySelector(`.${VALIDATION_MESSAGE_CLASS}`);

/** @type {HTMLButtonElement} */
const addToCartButtonEl = document.querySelector(`${ADD_TO_CART_PREFIX}btn`);

/** @type {HTMLElement} */
const addToCartButtonTextEl = document.querySelector(
  `${ADD_TO_CART_PREFIX}btn-text`
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
 * @property {boolean} isProgrammaticAddToCart
 * @property {boolean} isLoading Whether the add to cart submit is loading
 */

/**
 * @type {ModuleState}
 */
const DEFAULT_MODULE_STATE = {
  module: MODULE_NAME,
  currentVariant: null,
  isProgrammaticAddToCart: false,
  isLoading: false,
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
 * Adds a given quantity of the current variant to cart programmatically
 * @param {string | number} quantity
 */
const addToCartProgrammatically = quantity => {
  if (!quantityInputEl || !addToCartButtonEl) return;
  /** Update the state */
  state.updateState({
    isProgrammaticAddToCart: true
  });
  /** Set up the quantity input with the available quantity value */
  quantityInputEl.value = String(quantity);
  /**
   * We are clicking the UI button instead of performing an AJAX request or
   * submitting the form directly because we want to make sure the
   * Persistent Cart logic comes into play.
   * We have to ensure the button is not disabled before clicking it
   * The button is disabled before making this change
   * because the component doesn't re-render until the next tick
   */
  addToCartButtonEl.disabled = false;
  addToCartButtonEl.click();
};

$('body').on('addItemSuccess.ajaxCart', () => {
  state.updateState({ isLoading: false });
});

/**
 * @todo Remove jQuery dependency, if possible
 */
$('body').on('addItemError.ajaxCart', (e, { description }) => {
  const currentVariant = state.getState().currentVariant;

  if (!description || !currentVariant) return;

  // Update the state with the proper error message/UI state
  state.updateState({
    ...DEFAULT_MODULE_STATE,
    ...getShopifyErrorUIState(description),
    currentVariant,
    isLoading: false
  });

  if (isErrorScenario1(description)) {
    // Entirely sold out
    currentVariant.available = false;
    currentVariant.inventory_quantity = 0;
    handleVariantModification();
  }

  if (isErrorScenario2(description)) {
    /**
     * Add available items for current variant to cart programmatically using
     * the Shopify error message to provide the quantity
     */
    addToCartProgrammatically(getQuantityFromMessage(description));
  }
});

/**
 * The handler for when Add to Cart is clicked
 * @param {Event} event
 */
const onAddToCartClick = event => {
  const { currentVariant, isProgrammaticAddToCart } = state.getState();

  if (!currentVariant) {
    // Prevent Add To Cart form submit from going through
    event.preventDefault();
    handleAddToCartAttemptWithNoVariant();
    return;
  }

  if (isVariantOutOfStock(currentVariant) && window.BISPopover) {
    // Show modal, with current variant selected
    window.BISPopover.show({ variantId: currentVariant.id });
    // Set modal email input with customer's email
    /** @type {HTMLIFrameElement} */
    const BISPopoverEl = document.querySelector('#BIS_frame');
    /** @type {HTMLInputElement} */
    const BISPopoverEmailInputEl = BISPopoverEl.contentDocument.querySelector(
      '#email_address'
    );
    const customer = window.Shopify.customer;
    if (BISPopoverEmailInputEl && customer) {
      BISPopoverEmailInputEl.value = customer.email;
    }
  } else {
    setTimeout(() => {
      // Display loading state, but only after click event has propagated
      state.updateState({ isLoading: true });
    });
  }

  /**
   * If the ATC action was completed programmatically, then reset only the
   * `isProgrammaticAddToCart` flag and hold off resetting the UI state. This allows
   * the AJAX custom error to stay visible.
   */
  if (isProgrammaticAddToCart) {
    state.updateState({
      isProgrammaticAddToCart: false
    });
    return;
  }

  // Reset the state to the default for that variant
  // (clears out ajax shopify error state)
  state.updateState(getUIState(currentVariant));
};

/**
 * To be called when a different variant is selected.
 * Resets the state, including resetting ajax error messages
 * @param {Variant | undefined} newVariant
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
  addToCartButtonText,
  isLoading
}) => {
  /**
   * Give priority to the error messages. This ensures the UI gets updated
   * regardless of the availability of `addToCartButtonEl` or `addToCartButtonTextEl`
   */
  if (validationTextEl) {
    validationTextEl.textContent = validationText;
  }
  /**
   * From a UX perspective, group the button and button text check together
   */
  if (!addToCartButtonEl || !addToCartButtonTextEl) return;
  addToCartButtonEl.disabled = isAddToCartButtonDisabled || isLoading;
  const buttonText = isLoading ? 'Adding to cart' : addToCartButtonText;
  addToCartButtonTextEl.textContent = buttonText;
  // We are setting aria-label so that screen readers do not read the all-caps text as individual characters
  addToCartButtonTextEl.setAttribute('aria-label', buttonText);
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
