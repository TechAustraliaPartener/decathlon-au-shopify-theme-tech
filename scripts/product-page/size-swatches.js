// @ts-check

/**
 * Size Swatches "component"
 */

import {
  IS_ACTIVE_CLASS,
  JS_PREFIX,
  CSS_UTILITY_PREFIX,
  PRODUCT_PAGE_COPY
} from './constants';
// @todo Consider removing jQuery dependency
import $ from 'jquery';
import { createState } from './create-state';

/**
 * @typedef State
 * @property {string | null} size
 * @property {HTMLElement} selectedOption
 * @property {Variant | null} variant
 */

/** @type State */
const initialState = {
  size: null,
  selectedOption: null,
  variant: null
};

const state = createState(initialState);

/**
 * Module-specific constants
 */
const MODULE_NAME = 'SizeSwatches';
const SELECT_EVENT = `${MODULE_NAME}:select`;
const CLICK_EVENT = 'click';

/**
 * Root element
 */
export const $Swatches = $(`.${JS_PREFIX}SizeSwatches`);

const DEFAULT_TEXT_COLOR = `${CSS_UTILITY_PREFIX}textDarkGray`;
const ERROR_TEXT_COLOR = `${CSS_UTILITY_PREFIX}textRed`;

/**
 * Children elements
 */
const $SizeSwatchesOptions = $(`.${JS_PREFIX}SizeSwatches-option`);
const $SizeInfo = $(`.${JS_PREFIX}SizeInfo`);

/**
 * Trigger $SizeSwatches specific events
 *
 * @param {Object} state The current state
 * @fires SizeSwatches:select
 */
const notifyListeners = state => {
  /**
   * The SizeSwatches "select" event
   *
   * @event SizeSwatches:select
   * @type {object}
   * @property {string} size The size value selected
   */
  $Swatches.trigger(SELECT_EVENT, state);
};

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
const render = ({ selectedOption, size, variant }) => {
  // We need to update the selected color option UI state
  updateSizeUiState(selectedOption);
  // We need to update the selected color text
  $SizeInfo.text(variant ? size : PRODUCT_PAGE_COPY.SELECT_A_SIZE);
};

state.onChange(render);

/**
 * Handler for when a size choice is made
 *
 * @todo Consider removing jQuery dependency
 * @this HTMLElement The triggered size swatch option element
 */
const onSizeSelect = function() {
  const newState = state.updateState({
    // @todo Consider removing jQuery dependency
    // @ts-ignore
    size: $(this).val(),
    selectedOption: this
  });

  notifyListeners(newState);
  resetMissingSizeInfo();
};

/**
 * @param {Variant} variant
 */
export const onVariantSelect = variant => {
  state.updateState({ variant });
  resetMissingSizeInfo();
};

/**
 * Single size options are selected by default
 */
const selectSingleSizeOptions = () => {
  if ($SizeSwatchesOptions.length === 1) {
    $SizeSwatchesOptions[0].click();
  }
};

/**
 * Retrieves the currently selected size
 * @returns {string}
 */
export const getSelected = () => state.getState().size;

const showMissingSizeInfo = () => {
  $SizeInfo.removeClass(DEFAULT_TEXT_COLOR);
  $SizeInfo.addClass(ERROR_TEXT_COLOR);
};

const resetMissingSizeInfo = () => {
  $SizeInfo.removeClass(ERROR_TEXT_COLOR);
  $SizeInfo.addClass(DEFAULT_TEXT_COLOR);
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
  selectSingleSizeOptions();
};
