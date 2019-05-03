/**
 * This module updates the state of all of the color and size swatches
 * to show availability of other options based on currently selected options.
 * The selected options are also used to update the master select box with
 * the calculated variant ID.
 */

import {
  IS_OUT_OF_STOCK_CLASS,
  IS_SOLD_OUT_CLASS,
  JS_PREFIX
} from './constants';
import {
  isSoldOut,
  getAvailableColorsFromSize,
  getAvailableSizesFromColor
} from './product-data';
import $ from 'jquery';

// @todo Move color & size swatches logic out of this module and into
// the `ColorSwatches` & `SizeSwatches` modules
const colorSwatchesSelector = `.${JS_PREFIX}ColorSwatches-option`;
const sizeSwatchesSelector = `.${JS_PREFIX}SizeSwatches-option`;

/**
 * Checks product attributes for the "End of Life" tag and specifies whether the
 * unavailable state is "sold out" or "out of stock."
 *
 * @returns {string} A CSS class
 */
const getUnavailableCssClass = () => {
  if (isSoldOut()) {
    return IS_SOLD_OUT_CLASS;
  }
  return IS_OUT_OF_STOCK_CLASS;
};

/**
 * Updates the "unavailable" state by adding/removing a CSS class
 *
 * @todo Can this logic be handled in the ColorSwatches/SizeSwatches modules?
 * @param {string} optionCssClassName The options CSS class name
 * @param {Array} enabledOptions The enabled options to check against
 */
const updateOptionUnavailableState = (optionCssClassName, enabledOptions) => {
  // @todo Consider moving this logic to `ColorSwatches` & `SizeSwatches` modules
  $(optionCssClassName).each(function() {
    const isUnavailable = !enabledOptions.includes($(this).val());
    $(this).toggleClass(getUnavailableCssClass(), isUnavailable);
  });
};

/**
 * Updates the color & size options "available" states
 *
 * @todo Consider moving this logic to `ColorSwatches` & `SizeSwatches` modules
 * @param {Object} obj The state object
 * @param {string} obj.size The currently selected size
 * @param {string} obj.color The currently selected color
 */
export const updateOptionStates = ({ size, color }) => {
  // Update swatches with classes to display state in UI
  updateOptionUnavailableState(
    sizeSwatchesSelector,
    getAvailableSizesFromColor(color)
  );
  updateOptionUnavailableState(
    colorSwatchesSelector,
    getAvailableColorsFromSize(size)
  );
};
