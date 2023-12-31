// @ts-check

/**
 * ProductJSON module
 *
 * Provides helpers for interacting with the window.productJSON data
 */

import { NON_FOLLOWED_TAG } from './constants';

const productsJSON = window.productJSON;
const variantsJSON = productsJSON.variants;
const COLOR_INDEX = productsJSON.options.indexOf('Color');
const SIZE_INDEX = productsJSON.options.indexOf('Size');
const MODEL_INDEX = productsJSON.options.indexOf('Model Code');
const COLOR_OPTION = `option${COLOR_INDEX + 1}`;
const SIZE_OPTION = `option${SIZE_INDEX + 1}`;
const MODEL_OPTION = `option${MODEL_INDEX + 1}`;

export { variantsJSON as variants };

/**
 * @todo Make `MIN_QUANTITY_THRESHOLD` threshold dynamic based on theme settings
 */
const MIN_QUANTITY_THRESHOLD = 5;

/**
 * Searches for a given tag in the product tags
 *
 * @param {string} tag The tag to search for
 * @returns {boolean}
 */
const isTagFound = tag => productsJSON.tags.includes(tag);

/**
 * Helper to get the variant based on a color & size or ID
 *
 * @param {Object} obj The selected options data
 * @param {string} [obj.size] The selected size option
 * @param {string} [obj.color] The selected color option
 * @param {number} [obj.id] A product variant ID
 * @param {Array} [obj.source = variantsJSON] The array to filter to find a
 * product variant
 * @returns {Variant | undefined} A product variant object
 */
export const getSelectedVariant = ({
  size,
  color,
  id,
  source = variantsJSON
} = {}) => {
  if (!Array.isArray(source) || (!id && (!color || !size))) {
    return;
  }
  return source.find(
    variant =>
      (variant[SIZE_OPTION] === size && variant[COLOR_OPTION] === color) ||
      variant.id === id
  );
};

/**
 * Helper to get an available variant based on color & size or ID
 *
 * @param {Object} obj The selected options data
 * @param {string} [obj.size] The selected size option
 * @param {string} [obj.color] The selected color option
 * @param {number} [obj.id] A product variant ID
 * @returns {Variant | undefined} A product variant object
 */
export const getAvailableSelectedVariant = ({ size, id, color }) =>
  getSelectedVariant({ size, color, id, source: availableVariants() });

/**
 * Helper to determine if a product is an "End Of Life" product
 * @see https://app.gitbook.com/@decathlonusa/s/shopify/product-feature/product-page#sold-out-logic
 * @returns {boolean}
 */
export const isNonFollowedProduct = () => isTagFound(NON_FOLLOWED_TAG);

/**
 * Helper to determine if a product has varied prices
 *
 * @returns {boolean}
 */
export const isProductPricingVaried = () => {
  let manualCompareAtPrices = productsJSON.variants.map(v => v.compare_at_price);
  let manualCompareAtPriceVaries = manualCompareAtPrices => manualCompareAtPrices.every(v => v === manualCompareAtPrices[0]);
  return productsJSON.price_varies || manualCompareAtPriceVaries;
}

/**
 * Gets model code from variant
 *
 * @param {Variant} variant
 * @returns {string} Variant model code
 */
export const getModelCodeFromVariant = variant => variant[MODEL_OPTION];

/**
 * Filters for available variants
 *
 * @returns {Variant[]} An array of available variants
 */
export const availableVariants = () => variantsJSON.filter(isVariantAvailable);

/**
 * Returns all options (option1) that share a variant with given option (option2)
 *
 * @param {Object} params An object
 * @param {string} params.searchOption Title of option to find matches in
 * @param {string} params.findOption Title of option to match
 * @param {string | undefined} params.value Value of option to find matches in
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
 * @typedef {Object} VariantOptions
 * @property {string | null} size
 * @property {string | null} color
 * @property {string | null} model
 */

/**
 * @param {Variant} variant
 * @returns {VariantOptions}
 */
export const getVariantOptions = variant => ({
  size: variant[SIZE_OPTION],
  color: variant[COLOR_OPTION],
  model: variant[MODEL_OPTION]
});

export const checkIfVariantIsAllowedToOversell = (variantId) => {
  if (!window.productOversellThreshold && !window.variantsWithInventoryData) return false;
  
  const oversellThreshold = window.productOversellThreshold * -1;
  const variantWithInventoryData = window.variantsWithInventoryData.find(({ id }) => id == variantId);
  const inventoryQuantity = variantWithInventoryData ? variantWithInventoryData.inventory_quantity : undefined;
  const inventoryPolicy = variantWithInventoryData ? variantWithInventoryData.inventory_policy : undefined;
  const variantIsAllowedToOversell = inventoryPolicy === 'continue' && inventoryQuantity > oversellThreshold;
  // console.log('Test checkIfVariantIsAllowedToOversell', { variantId, variantWithInventoryData, variantIsAllowedToOversell, inventoryPolicy, inventoryQuantity, oversellThreshold })

  return variantIsAllowedToOversell;
}

export const checkIfVariantIsNonInventory = (variantId) => {
  if (!window.variantsWithInventoryData) return false;

  // Check variant availability for delivery and pickup
  const variantLocationsInventory = (window.inventories || {})[variantId];
  if (!variantLocationsInventory) return false;

  const { delivery, locations } = variantLocationsInventory.inventoryItem;
  const filteredLocations = locations.filter(loc => loc.available > 0);
  // Variant should be unavailable for both delivery and pickup to consider as non-inventory
  if (filteredLocations.length > 0 || delivery.available > 0) return false;

  const variantWithInventoryData = window.variantsWithInventoryData.find(({ id }) => id == variantId);
  const variantIsAllowedToOversell = checkIfVariantIsAllowedToOversell(variantId);
  console.log({variantWithInventoryData, variantIsAllowedToOversell});
  return variantWithInventoryData.available && variantIsAllowedToOversell === false;
}

/**
 * Helper to know if a product variant is available
 * @param {Variant} variant
 * @returns {boolean}
 */
export const isVariantAvailable = variant => {
  const variantInventory = window.productJSON.variants.find(v => v.id === variant.id);
  const variantLocationsInventory = (window.inventories || {})[variant.id];

  let isAvailable = false;

  if (variantLocationsInventory) {
    const { inventoryItem } = variantLocationsInventory;
    const { delivery, locations } = inventoryItem;

    const filteredLocations = locations.filter(loc => {
      return loc.available > 0;
    });

    isAvailable = (filteredLocations.length > 0 || delivery.available > 0);
  } else {
    isAvailable = variant && variant.available;
  }

  // If unavailable check if it oversell or is a non-inventory
  if (variant && isAvailable === false) {
    isAvailable = checkIfVariantIsAllowedToOversell(variant.id) || checkIfVariantIsNonInventory(variant.id);
  }

  // return variant && variant.available;
  return isAvailable;
}

/**
 * Helper to know if a product variant is "out of stock"
 * @see https://app.gitbook.com/@decathlonusa/s/shopify/product-feature/product-page#sold-out-logic
 * @param {Variant} variant
 * @returns {boolean}
 */
export const isVariantOutOfStock = variant =>
  !isVariantAvailable(variant) && !isNonFollowedProduct();

/**
 * Helper to know if a product variant is "sold out"
 * @see https://app.gitbook.com/@decathlonusa/s/shopify/product-feature/product-page#sold-out-logic
 * @param {Variant} variant
 * @returns {boolean}
 */
export const isVariantSoldOut = variant =>
  !isVariantAvailable(variant) && isNonFollowedProduct();

/**
 * Helper to know if a product variant is "Click & Collect"
 * @param {Variant} variant
 * @returns {boolean}
 */
export const isVariantCC = variant => {
  const v = window.vars.productJSON.variants.find(obj => {
    return obj.id === variant.id;
  });
  return v.cc || false;
};

/**
 * Helper to determine if a given variant has quantity above the minimum threshold
 * @param {Variant} variant
 * @returns {boolean}
 */
export const variantHasSufficientQuantity = variant =>
  variant.inventory_quantity >= MIN_QUANTITY_THRESHOLD;
