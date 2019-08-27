// @ts-check

/**
 * This module updates the state of all of the color and size swatches
 * to show availability of other options based on currently selected options.
 * The selected options are also used to update the master select box with
 * the calculated variant ID.
 */

import {
  IS_OUT_OF_STOCK_CLASS,
  IS_SOLD_OUT_CLASS,
  IS_HIDDEN_CLASS,
  JS_PREFIX
} from './constants';
import {
  isNonFollowedProduct,
  getAvailableColorsFromSize,
  getAvailableSizesFromColor,
  getExistingColorsFromSize,
  getExistingSizesFromColor
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
  if (isNonFollowedProduct()) {
    return IS_SOLD_OUT_CLASS;
  }
  return IS_OUT_OF_STOCK_CLASS;
};

/**
 * @todo Can this logic be handled in the ColorSwatches/SizeSwatches modules?
 * @param {JQuery<HTMLButtonElement>} elements
 * @param {Object} opts
 * @param {string[]} opts.existingOptions
 * @param {string} opts.nonexistentClass
 * @param {string[]} opts.availableOptions
 * @param {string} opts.unavailableClass
 */
const updateOptions = (elements, opts) => {
  elements.each(function() {
    const element = this;
    const value = element.value;
    // Reset the classes on the element
    element.classList.remove(opts.nonexistentClass);
    element.classList.remove(opts.unavailableClass);
    // Then reapply them as needed
    // Removing and adding are done separately because the nonexistent class and unavailable class could be the same thing
    if (!opts.existingOptions.includes(value)) {
      element.classList.add(opts.nonexistentClass);
    }
    if (!opts.availableOptions.includes(value)) {
      element.classList.add(opts.unavailableClass);
    }
  });
};

/**
 * Updates the color & size options "available" states
 *
 * @todo Consider moving this logic to `ColorSwatches` & `SizeSwatches` modules
 * @param {Object} state
 * @param {string | undefined} state.size
 * @param {string | undefined} state.color
 * @param {Variant | undefined} state.variant
 */
export const updateOptionStates = ({ size, color, variant }) => {
  /** @type JQuery<HTMLButtonElement> */
  const colorSwatches = $(colorSwatchesSelector);
  /** @type JQuery<HTMLButtonElement> */
  const sizeSwatches = $(sizeSwatchesSelector);

  // Update swatches with classes to display state in UI
  updateOptions(sizeSwatches, {
    existingOptions: getExistingSizesFromColor(color),
    nonexistentClass: IS_HIDDEN_CLASS,
    availableOptions: getAvailableSizesFromColor(color),
    unavailableClass: getUnavailableCssClass()
  });
  updateOptions(colorSwatches, {
    existingOptions: getExistingColorsFromSize(
      // If there is a variant selected, then grey out the variants that don't exist for the current size
      // if there is no variant selected (meaning either size is not selected, or the selected size doesn't exist for this color)
      // then we display them all as not-greyed-out
      variant && size
    ),
    nonexistentClass: IS_OUT_OF_STOCK_CLASS,
    availableOptions: getAvailableColorsFromSize(
      // If there is a variant selected, then grey out the variants that aren't available for the current size
      // if there is no variant selected (meaning either size is not selected, or the selected size doesn't exist for this color)
      // then we display them all as not-greyed-out
      variant && size
    ),
    unavailableClass: getUnavailableCssClass()
  });
};
