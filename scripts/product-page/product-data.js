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
 * @param {string} obj.color The selected color option
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
 * Returns all options (option1) that share a variant with given option (option2)
 *
 * @param {Object} params An object
 * @param {string} params.searchOption Title of option to find matches in
 * @param {string} params.findOption Title of option to match
 * @param {string} params.value Value of option to find matches in
 * @param {Array} params.variants Array of variants to filter on
 * @returns {Array} Options with matches to given option
 */
const getOptionCombinations = ({
  searchOption,
  findOption,
  value,
  variants
}) => {
  return variants.reduce((accArray, variant) => {
    if (!accArray.includes(variant[searchOption])) {
      if (value) {
        if (value === variant[findOption]) {
          accArray.push(variant[searchOption]);
        }
      } else {
        accArray.push(variant[searchOption]);
      }
    }
    return accArray;
  }, []);
};

/**
 * Gets existing colors from size
 *
 * @param {string} size A size value
 * @returns {Array} Existing colors
 */
export const getExistingColorsFromSize = size =>
  getOptionCombinations({
    searchOption: COLOR_OPTION,
    findOption: SIZE_OPTION,
    value: size,
    variants: variantsJSON
  });

/**
 * Gets existing sizes from color
 *
 * @param {string} color A color value
 * @returns {Array} Existing sizes
 */
export const getExistingSizesFromColor = color =>
  getOptionCombinations({
    searchOption: SIZE_OPTION,
    findOption: COLOR_OPTION,
    value: color,
    variants: variantsJSON
  });

/**
 * Gets available colors from size
 *
 * @param {string} size A size value
 * @returns {Array} Available colors
 */
export const getAvailableColorsFromSize = size =>
  getOptionCombinations({
    searchOption: COLOR_OPTION,
    findOption: SIZE_OPTION,
    value: size,
    variants: availableVariants()
  });

/**
 * Gets available sizes from color
 *
 * @param {string} color A color value
 * @returns {Array} Available sizes
 */
export const getAvailableSizesFromColor = color =>
  getOptionCombinations({
    searchOption: SIZE_OPTION,
    findOption: COLOR_OPTION,
    value: color,
    variants: availableVariants()
  });

/**
 * Returns the options of a variant by ID using global variantsJSON array
 * derived from global productJSON
 *
 * @param {string} VariantId The variant ID
 * @returns {Object[]} An object containing options
 */
export const variantOptions = variantId => {
  const options = { size: null, color: null, model: null };
  if (Array.isArray(variantsJSON)) {
    const variant = variantsJSON.find(variant => variant.id === variantId);
    if (variant) {
      options.size = variant[SIZE_OPTION];
      options.color = variant[COLOR_OPTION];
      options.model = variant[MODEL_OPTION];
    }
  }

  return options;
};
