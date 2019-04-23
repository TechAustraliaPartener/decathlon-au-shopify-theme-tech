/**
 * Color Swatches "component"
 */

import { IS_ACTIVE_CLASS, JS_PREFIX } from './constants';
import $ from 'jquery';
import { updateOptionStates } from './option-states';

/**
 * Module-specific constants
 */
const MODULE_NAME = 'ColorSwatches';
const SELECT_EVENT = `${MODULE_NAME}:select`;
const CLICK_EVENT = 'click';

/**
 * Root element
 */
const $ColorSwatches = $(`.${JS_PREFIX}ColorSwatches`);

/**
 * Children elements
 */
const $ColorSwatchesOptions = $ColorSwatches.find(
  `.${JS_PREFIX}ColorSwatches-option`
);
const $ColorInfo = $(`.${JS_PREFIX}ColorInfo`);

/**
 * Trigger $ColorSwatches specific events
 *
 * @fires ColorSwatches:select
 */
function notifyListeners() {
  /**
   * The ColorSwatches "select" event
   *
   * @event ColorSwatches:select
   * @type {object}
   * @property {string} value The color value selected
   */
  $ColorSwatches.trigger(SELECT_EVENT, { value: $(this).val() });
}

/**
 * Handles UI updates for the Color Swatches component
 */
function updateUI() {
  selectColor.call(this);
  $ColorInfo.text($(this).val());
  updateOptionStates();
}

/**
 * Updates the selected color UI state
 */
function selectColor() {
  // Visually unselect all options
  $ColorSwatchesOptions.removeClass(IS_ACTIVE_CLASS);
  // Then visually select the current option
  $(this).addClass(IS_ACTIVE_CLASS);
}

/**
 * Handler for when a color choice is made
 */
function onColorSelect() {
  notifyListeners.call(this);
  updateUI.call(this);
}
/**
 * Initializes functionality by setting up event binding
 *
 * @returns {jQuery} The root jQuery $ColorSwatches object
 */
function init() {
  $ColorSwatchesOptions.on(CLICK_EVENT, onColorSelect);
  return $ColorSwatches;
}

export default {
  init
};
