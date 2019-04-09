/**
 * Size Swatches "component"
 */

import { IS_ACTIVE_CLASS, JS_PREFIX } from './constants';
import $ from 'jquery';

/**
 * Module-specific constants
 */
const MODULE_NAME = 'SizeSwatches';
const SELECT_EVENT = `${MODULE_NAME}:select`;
const CLICK_EVENT = 'click';

/**
 * Root element
 */
const $SizeSwatches = $(`.${JS_PREFIX}SizeSwatches`);

/**
 * Children elements
 */
const $SizeSwatchesOptions = $SizeSwatches.find(
  `.${JS_PREFIX}SizeSwatches-option`
);
const $SizeInfo = $(`.${JS_PREFIX}SizeInfo`);

/**
 * Trigger $SizeSwatches specific events
 *
 * @fires SizeSwatches:select
 */
function notifyListeners() {
  /**
   * The SizeSwatches "select" event
   *
   * @event SizeSwatches:select
   * @type {object}
   * @property {string} value The size value selected
   */
  $SizeSwatches.trigger(SELECT_EVENT, { value: $(this).val() });
}

/**
 * Handles UI updates for the Size Swatches component
 */
function updateUI() {
  selectSize.call(this);
  $SizeInfo.text($(this).val());
}

/**
 * Updates the selected size UI state
 */
function selectSize() {
  // Visually unselect all options
  $SizeSwatchesOptions.removeClass(IS_ACTIVE_CLASS);
  // Then visually select the current option
  $(this).addClass(IS_ACTIVE_CLASS);
}

/**
 * Handler for when a size choice is made
 */
function onSizeSelect() {
  notifyListeners.call(this);
  updateUI.call(this);
}
/**
 * Initializes functionality by setting up event binding
 *
 * @returns {jQuery} The root jQuery $SizeSwatches object
 */
function init() {
  $SizeSwatchesOptions.on(CLICK_EVENT, onSizeSelect);
  return $SizeSwatches;
}

export default {
  init
};
