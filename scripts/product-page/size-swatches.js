// @ts-check

/**
 * Size Swatches "component"
 */

import {
  IS_ACTIVE_CLASS,
  VALIDATION_MESSAGE_CLASS,
  JS_PREFIX,
  PRODUCT_PAGE_COPY,
  IS_HIDDEN_CLASS
} from './constants';
// @todo Consider removing jQuery dependency
import $ from 'jquery';
import { createState } from './create-state';
import { getExistingSizesFromColor } from './product-data';

/**
 * @typedef State
 * @property {string | null | undefined} size
 * @property {HTMLElement | undefined} selectedOption
 * @property {Variant | null | undefined} variant
 * @property {string | null | undefined} color
 */

/** @type State */
const initialState = {
  size: null,
  selectedOption: null,
  variant: null,
  color: null
};

const state = createState(initialState);

/**
 * Module-specific constants
 */
const CLICK_EVENT = 'click';

/**
 * Root element
 */
export const $Swatches = $(`.${JS_PREFIX}SizeSwatches`);

/** @type {NodeListOf<HTMLButtonElement>} */
export const swatchOptionEls = document.querySelectorAll(
  `.${JS_PREFIX}SizeSwatches-option`
);

/** @type {HTMLElement} */
const validationTextEl = document.querySelector(`.${VALIDATION_MESSAGE_CLASS}`);

const $SizeSwatchesOptions = $(swatchOptionEls);
const $SizeInfo = $(`.${JS_PREFIX}SizeInfo`);

/**
 * Updates the selected size UI state
 *
 * @param {Element} selectedOption The selected option HTML element
 */
const updateSizeUiState = selectedOption => {
  // Visually unselect all options
  $SizeSwatchesOptions.removeClass(IS_ACTIVE_CLASS);
  // Then visually select the current option
  $(selectedOption).addClass(IS_ACTIVE_CLASS);
};

/**
 * Makes the DOM match the state
 * @param {State} state
 */
const render = ({ selectedOption, size, variant, color }) => {
  $Swatches.toggleClass(
    IS_HIDDEN_CLASS,
    getExistingSizesFromColor(color).length === 1
  );
  // We need to update the selected color option UI state
  updateSizeUiState(selectedOption);
  // We need to update the selected color text
  $SizeInfo.text(variant ? size : PRODUCT_PAGE_COPY.SELECT_A_SIZE);
};

state.onChange(render);

/**
 * @param {string | undefined} color
 */
export const onColorSelect = color => {
  const existingSizes = getExistingSizesFromColor(color);
  // If there is only one size for the currently selected color, select that size
  if (existingSizes.length === 1) {
    const onlyApplicableSize = existingSizes[0];
    if (onlyApplicableSize !== state.getState().size) {
      const target = $SizeSwatchesOptions
        .filter((_index, el) => el.value === onlyApplicableSize)
        .get(0);
      onSizeSelect.bind(target)();
    }
  }
  state.updateState({ color });
};

/** @param {(size: string) => void} cb */
export const handleSizeSelect = cb =>
  state.onChange(({ size }) => cb(size), state => [state.size]);

/**
 * Handler for when a size choice is made
 *
 * @todo Consider removing jQuery dependency
 * @this HTMLElement The triggered size swatch option element
 */
const onSizeSelect = function() {
  state.updateState({
    // @todo Consider removing jQuery dependency
    // @ts-ignore
    size: $(this).val(),
    selectedOption: this
  });

  resetMissingSizeInfo();
};

/**
 * @param {Variant} variant
 */
export const onVariantSelect = variant => {
  state.updateState({ variant });
  resetMissingSizeInfo();
};

const showMissingSizeInfo = () => {
  if (validationTextEl) {  
    validationTextEl.textContent = PRODUCT_PAGE_COPY.SELECT_A_SIZE;
  }
};

const resetMissingSizeInfo = () => {
  if (validationTextEl) {
    validationTextEl.textContent = '';
  }
};

export const handleAddToCartAttemptWithNoVariant = () => {
  // Can't add to cart if no size is selected
  showMissingSizeInfo();
};

/**
 * Initializes functionality by setting up event binding
 *
 * @todo Consider removing jQuery dependency
 */
export const init = () => {
  $SizeSwatchesOptions.on(CLICK_EVENT, onSizeSelect);
};
