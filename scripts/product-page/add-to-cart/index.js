// https://testing-decathlon-usa.myshopify.com/products/basketball-shoes-strong-500-low-inventory?
// /products/10-l-fast-hiking-backpack-helium?variant=12571110015048
// /collections/mens-running-shoes/products/mens-running-cushion-shoes?variant=12964007051336

import $ from 'jquery';
import { VALIDATION_MESSAGE_CLASS, JS_PREFIX } from '../constants';
import { isVariantOutOfStock } from '../product-data';
import { createState } from '../../utilities/create-state';
import {
  getUIState,
  getShopifyErrorUIState,
  getQuantityFromMessage,
  DEFAULT_UI_STATE
} from './ui-state';
import { handleAddToCartAttemptWithNoVariant } from '../size-swatches';
import { isErrorScenario1, isErrorScenario2 } from './error-scenarios';

const MODULE_NAME = 'AddToCart';
const ADD_TO_CART_PREFIX = `.${JS_PREFIX}${MODULE_NAME}-`;

const quantityInputEl = document.querySelector(`${ADD_TO_CART_PREFIX}quantity`);
const validationTextEl = document.querySelector(`.${VALIDATION_MESSAGE_CLASS}`);
const stockMessageTextEl = document.querySelector('.js-de-stock-info-message .message');
const addToCartButtonEl = document.querySelector(`${ADD_TO_CART_PREFIX}btn`);
const addToCartButtonTextEl = document.querySelector(`${ADD_TO_CART_PREFIX}btn-text`);

const DEFAULT_MODULE_STATE = {
  module: MODULE_NAME,
  currentVariant: null,
  isProgrammaticAddToCart: false,
  isLoading: false,
  ...DEFAULT_UI_STATE
};

const state = createState(DEFAULT_MODULE_STATE);

const variantModificationListeners = [];

// Listens to change in variant quantities
export const onVariantModification = cb =>
  variantModificationListeners.push(cb);

const handleVariantModification = () => {
  variantModificationListeners.forEach(listener => listener());
};

const addToCartProgrammatically = quantity => {
  if (!quantityInputEl || !addToCartButtonEl) return;
  state.updateState({
    isProgrammaticAddToCart: true
  });

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
    /*  Add available items for current variant to cart programmatically using
        the Shopify error message to provide the quantity */
    addToCartProgrammatically(getQuantityFromMessage(description));
  }
});

const onAddToCartClick = event => {
  const { currentVariant, isProgrammaticAddToCart } = state.getState();

  let requestQuantity = document.getElementById('Quantity');
  if (!requestQuantity.checkValidity()) {
    return;
  }

  if (!currentVariant) {
    event.preventDefault();
    handleAddToCartAttemptWithNoVariant();
    return;
  }

  if (isVariantOutOfStock(currentVariant) && window.BISPopover) {
    // Show modal, with current variant selected
    window.BISPopover.show({ variantId: currentVariant.id });

    // Set modal email input with customer's email
    const BISPopoverEl = document.querySelector('#BIS_frame');
    const BISPopoverEmailInputEl = BISPopoverEl.contentDocument.querySelector('#email_address');
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

  /*  If the ATC action was completed programmatically, then reset only the
      `isProgrammaticAddToCart` flag and hold off resetting the UI state. This allows
      the AJAX custom error to stay visible.*/
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

export const onVariantSelect = newVariant => {
  state.updateState({
    ...DEFAULT_MODULE_STATE,
    ...getUIState(newVariant),
    currentVariant: newVariant,

  });
};

const render = ({
  isAddToCartButtonDisabled,
  validationText,
  addToCartButtonText,
  bisHidden,
  isLoading
}) => {
  /*  Give priority to the error messages. This ensures the UI gets updated
      regardless of the availability of `addToCartButtonEl` or `addToCartButtonTextEl` */
  if (validationTextEl) {
    validationTextEl.textContent = validationText;
  }

  if (stockMessageTextEl && stockMessageTextEl.textContent && validationTextEl.textContent !== '') {
    stockMessageTextEl.textContent = '';
  }

  // if (bisHidden) {
  //   // alert("CLEARANCE SALE " + bisHidden);
  //   document.querySelector('.de-AddToCartActions .de-ProductQuantity').classList.remove('de-u-md-block');
  //   addToCartButtonEl.classList.add('bis-hidden');
  //   $('.js-de-AddToCart-btn').closest('.de-AddToCartActions').addClass('full-width-button');
  // }

  if (!addToCartButtonEl || !addToCartButtonTextEl) return;

  addToCartButtonEl.disabled = isAddToCartButtonDisabled || isLoading;
  const buttonText = isLoading ? 'Adding to cart' : addToCartButtonText;
  addToCartButtonTextEl.textContent = buttonText;

  // We are setting aria-label so that screen readers do not read the all-caps text as individual characters
  addToCartButtonTextEl.setAttribute('aria-label', buttonText);
};

state.onChange(render);

export const init = () => {
  if (addToCartButtonEl) {
    addToCartButtonEl.addEventListener('click', onAddToCartClick);
  }
};
