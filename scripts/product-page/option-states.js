/**
 * This module updates the state of all of the color and size swatches
 * to show availability of other options based on currently selected options.
 * The selected options are also used to update the master select box with
 * the calculated variant ID.
 */

import {
  IS_SOLD_OUT_TAG,
  IS_ACTIVE_CLASS,
  IS_OUT_OF_STOCK_CLASS,
  IS_SOLD_OUT_CLASS,
  JS_PREFIX
} from './constants';
import $ from 'jquery';

const productsJSON = window.productJSON;
const variantsJSON = productsJSON.variants;
const colorIndex = productsJSON.options.indexOf('Color');
const sizeIndex = productsJSON.options.indexOf('Size');
const COLOR_OPTION = `option${colorIndex + 1}`;
const SIZE_OPTION = `option${sizeIndex + 1}`;
const colorSwatchesSelector = `.${JS_PREFIX}ColorSwatches-option`;
const sizeSwatchesSelector = `.${JS_PREFIX}SizeSwatches-option`;
const $masterSelect = $('#productSelect');

/**
 * Checks product attributes for the "End of Life" tag and specifies whether the
 * unavailable state is "sold out" or "out of stock."
 *
 * @returns {string} A CSS class
 */
function getUnavailableCssClass() {
  if (productsJSON.tags.includes(IS_SOLD_OUT_TAG)) {
    return IS_SOLD_OUT_CLASS;
  }
  return IS_OUT_OF_STOCK_CLASS;
}

/**
 * Finds variant id based on size and color selection and updated
 * master variant select element
 * @param {string} selectedSize Value of the selected size option
 * @param {string} selectedColor Value of the selected color option
 */
function updateMasterSelect(selectedSize, selectedColor) {
  const selectedVariant = variantsJSON.find(
    variant =>
      variant[SIZE_OPTION] === selectedSize &&
      variant[COLOR_OPTION] === selectedColor
  );
  if (selectedVariant) {
    $masterSelect.val(selectedVariant.id);
  }
}

/**
 * Returns the selected value for the given option
 * @param {string} The CSS class name of the option
 * @returns {string} The option value
 */
function getSelectedOptionValue(cssClassOptionName) {
  const $option = $(cssClassOptionName);

  if ($option.size() > 0) {
    return $option.first().val();
  }
  return '';
}

/**
 * Filters available variants
 */
const availableVariants = variantsJSON.filter(variant => variant.available);

/**
 * Returns the available colors given a size
 *
 * @param {string} size A size option
 * @returns {Array} Available colors
 */
function getAvailableColorsFromSize(size) {
  return availableVariants.reduce((accArray, variant) => {
    if (!accArray.includes(variant[COLOR_OPTION])) {
      if (size) {
        if (size === variant[SIZE_OPTION]) {
          accArray.push(variant[COLOR_OPTION]);
        }
      } else {
        accArray.push(variant[COLOR_OPTION]);
      }
    }
    return accArray;
  }, []);
}

/**
 * Returns the available sizes given a color
 *
 * @param {string} color A color option
 * @returns {Array} Available sizes
 */
function getAvailableSizesFromColor(color) {
  return availableVariants.reduce((accArray, variant) => {
    if (!accArray.includes(variant[SIZE_OPTION])) {
      if (color) {
        if (color === variant[COLOR_OPTION]) {
          accArray.push(variant[SIZE_OPTION]);
        }
      } else {
        accArray.push(variant[SIZE_OPTION]);
      }
    }
    return accArray;
  }, []);
}

/**
 * Updates the "unavailable" state by adding/removing a CSS class
 *
 * @param {string} optionCssClassName The options CSS class name
 * @param {Array} enabledOptions The enabled options to check against
 */
function updateOptionUnavailableState(optionCssClassName, enabledOptions) {
  const unavailableClass = getUnavailableCssClass();
  $(optionCssClassName).each(function() {
    const isUnavailable = !enabledOptions.includes($(this).val());
    $(this).toggleClass(unavailableClass, isUnavailable);
  });
}

export function updateOptionStates() {
  // Get value of selected color
  const selectedColor = getSelectedOptionValue(
    `${colorSwatchesSelector}.${IS_ACTIVE_CLASS}`
  );

  // Get value of selected size
  const selectedSize = getSelectedOptionValue(
    `${sizeSwatchesSelector}.${IS_ACTIVE_CLASS}`
  );

  // Calculate available sizes and colors based on selected swatches
  const availableColors = getAvailableColorsFromSize(selectedSize);
  const availableSizes = getAvailableSizesFromColor(selectedColor);

  // Update swatches with classes to display state in UI
  updateOptionUnavailableState(sizeSwatchesSelector, availableSizes);
  updateOptionUnavailableState(colorSwatchesSelector, availableColors);

  // Get variant ID and update master select element to set the variant that will add to cart
  if (selectedSize && selectedColor) {
    updateMasterSelect(selectedSize, selectedColor);
  }
}
