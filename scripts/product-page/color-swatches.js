// @ts-check

/**
 * Color Swatches "component"
 */

import { IS_ACTIVE_CLASS, JS_PREFIX } from './constants';
// @todo Consider removing jQuery dependency
import $ from 'jquery';
import { availableVariants, getVariantOptions } from './product-data';

/**
 * Module state
 */
let state = {
  color: null
};

/**
 * Module-specific constants
 */
const MODULE_NAME = 'ColorSwatches';
const SELECT_EVENT = `${MODULE_NAME}:select`;
const CLICK_EVENT = 'click';

/**
 * Root element
 */
export const $ColorSwatches = $(`.${JS_PREFIX}ColorSwatches`);

/**
 * Children elements
 * @type {JQuery<HTMLButtonElement>}
 */
const $ColorSwatchesOptions = $(`.${JS_PREFIX}ColorSwatches-option`);
const $ColorInfo = $(`.${JS_PREFIX}ColorInfo`);

/**
 * Updates the module state
 *
 * @param {Object} newState The new state
 * @returns {Object} The up-to-date state
 */
const updateState = newState => {
  // Assign the new state to the old state
  state = {
    ...state,
    ...newState
  };
  // For convenience, return the updated state
  return state;
};

/**
 * Trigger $ColorSwatches specific events
 *
 * @param {Object} state The current state
 * @fires ColorSwatches:select
 */
const notifyListeners = state => {
  /**
   * The ColorSwatches "select" event
   *
   * @event ColorSwatches:select
   * @type {object}
   * @property {string} color The color value selected
   */
  $ColorSwatches.trigger(SELECT_EVENT, state);
};

/**
 * Updates the selected color UI state
 *
 * @param {Element} selectedOption The selected option HTML element
 */
const updateColorUiState = selectedOption => {
  // Visually unselect all options
  $ColorSwatchesOptions.removeClass(IS_ACTIVE_CLASS);
  // Then visually select the current option
  $(selectedOption).addClass(IS_ACTIVE_CLASS);
};

export const selectFirstSwatch = () => {
  const firstAvailableVariant = availableVariants()[0];
  const { color } = getVariantOptions(firstAvailableVariant);
  const firstAvailableVariantSwatch = $ColorSwatchesOptions
    .toArray()
    .find(el => el.value === color);
  firstAvailableVariantSwatch.click();
};

/**
 * Handles UI updates for the Color Swatches component
 *
 * @param {Object} obj
 * @param {Object} obj.state The current state
 * @param {HTMLElement} obj.selectedOption The selected option HTML element
 */
const updateUI = ({ state, selectedOption }) => {
  // We need to update the selected color option UI state
  updateColorUiState(selectedOption);
  // We need to update the selected color text
  $ColorInfo.text(state.color);
};

/**
 * Handler for when a color choice is made
 *
 * @todo Consider removing jQuery dependency
 * @this {HTMLElement} The triggered color swatch option element
 */
const onColorSelect = function() {
  const newState = updateState({
    // @todo Consider removing jQuery dependency
    color: $(this).val()
  });

  notifyListeners(newState);
  updateUI({
    state: newState,
    selectedOption: this
  });
};

/**
 * Helper to retrieve the module state
 *
 * @returns {Object} The module state
 */
export const getState = () => state;

/**
 * Single color options are selected by default
 */
const selectSingleColorOptions = () => {
  if ($ColorSwatchesOptions.length === 1) {
    $ColorSwatchesOptions[0].click();
  }
};

/**
 * Initializes functionality by setting up event binding
 *
 * @todo Consider removing jQuery dependency
 */
export const init = () => {
  $ColorSwatchesOptions.on(CLICK_EVENT, onColorSelect);
  selectSingleColorOptions();
};
