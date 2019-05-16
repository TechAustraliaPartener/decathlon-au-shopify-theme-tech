/**
 * ProductJSON module
 *
 * Provides helpers for interacting with the window.productJSON data
 */

import { IS_SOLD_OUT_TAG } from './constants';

const productsJSON = window.productJSON;
const variantsJSON = productsJSON.variants;
const COLOR_INDEX = productsJSON.options.indexOf('Color');
const SIZE_INDEX = productsJSON.options.indexOf('Size');
const MODEL_INDEX = productsJSON.options.indexOf('Model Code');
const COLOR_OPTION = `option${COLOR_INDEX + 1}`;
const SIZE_OPTION = `option${SIZE_INDEX + 1}`;
const MODEL_OPTION = `option${MODEL_INDEX + 1}`;

/**
 * Searches for a given tag in the product tags
 *
 * @param {string} tag The tag to search for
 * @returns {boolean}
 */
const isTagFound = tag => productsJSON.tags.includes(tag);

/**
 * Helper to get the variant based on the selected color & size
 *
 * @param {Object} obj The selected options data
 * @param {string} obj.size The selected size option
 * @param {string} obj.color The selected colore option
 * @returns {Object|undefined} A product variant object
 */
export const getSelectedVariant = ({ size, color }) =>
  variantsJSON.find(
    variant => variant[SIZE_OPTION] === size && variant[COLOR_OPTION] === color
  );

/**
 * Helper to get if product has "sold out" tag
 *
 * @returns {boolean}
 */
export const isSoldOut = () => isTagFound(IS_SOLD_OUT_TAG);

/**
 * Gets model code from variant
 *
 * @param {Object} variant The variant object
 * @returns {string} Variant model code
 */
export const getModelCodeFromVariant = variant => variant[MODEL_OPTION];

/**
 * Filters for available variants
 *
 * @returns {Object[]} An array of available variants
 */
export const availableVariants = () =>
  variantsJSON.filter(variant => variant.available);

/**
 * Returns the available colors given a size
 *
 * @param {string} size A size option
 * @returns {Array} Available colors
 */
export const getAvailableColorsFromSize = size => {
  return availableVariants().reduce((accArray, variant) => {
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
};

/**
 * Returns the available sizes given a color
 *
 * @param {string} color A color option
 * @returns {Object[]} Available sizes
 */
export const getAvailableSizesFromColor = color => {
  return availableVariants().reduce((accArray, variant) => {
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
};
