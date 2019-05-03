/**
 * Size Swatches "component"
 */

import { IS_ACTIVE_CLASS, JS_PREFIX } from './constants';
// @todo Consider removing jQuery dependency
import $ from 'jquery';

/**
 * Module state
 */
let state = {
  size: null
};

/**
 * Module-specific constants
 */
const MODULE_NAME = 'SizeSwatches';
const SELECT_EVENT = `${MODULE_NAME}:select`;
const CLICK_EVENT = 'click';

/**
 * Root element
 */
export const $SizeSwatches = $(`.${JS_PREFIX}SizeSwatches`);

/**
 * Children elements
 */
const $SizeSwatchesOptions = $SizeSwatches.find(
  `.${JS_PREFIX}SizeSwatches-option`
);
const $SizeInfo = $(`.${JS_PREFIX}SizeInfo`);

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
  $SizeSwatches.trigger(SELECT_EVENT, state);
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
 * Handles UI updates for the Size Swatches component
 *
 * @param {Object} obj
 * @param {Object} obj.state The current state
 * @param {Element} obj.selectedOption The selected option HTML element
 */
const updateUI = ({ state, selectedOption }) => {
  // We need to update the selected color option UI state
  updateSizeUiState(selectedOption);
  // We need to update the selected color text
  $SizeInfo.text(state.size);
};

/**
 * Handler for when a size choice is made
 *
 * @todo Consider removing jQuery dependency
 * @this $SizeSwatchesOptions The triggered size swatch option element
 */
const onSizeSelect = function() {
  const newState = updateState({
    // @todo Consider removing jQuery dependency
    size: $(this).val()
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
 * Initializes functionality by setting up event binding
 *
 * @todo Consider removing jQuery dependency
 */
export const init = () => {
  $SizeSwatchesOptions.on(CLICK_EVENT, onSizeSelect);
};
