import { getSelectedVariant } from './product-data';
import { JS_PREFIX, CSS_UTILITY_PREFIX } from './constants';

const isFlagClass = c =>
  // IE doesn't support string#startsWith, so we are using a regex instead of polyfill
  c.match(new RegExp(`^${CSS_UTILITY_PREFIX}bg`)) ||
  c.match(new RegExp(`^${CSS_UTILITY_PREFIX}text(?:White|Black)`)) ||
  c.match(new RegExp(`^${CSS_UTILITY_PREFIX}hidden`));

/**
 * Updates product flags
 * @param {Object} options
 * @param {string} options.size The selected size option
 * @param {string} options.color The selected color option
 */
export const updateUI = ({ size, color }) => {
  const currentVariant = getSelectedVariant({ size, color });
  const product = window.productJSON;

  const isOnSale = currentVariant.compare_at_price > currentVariant.price;
  const productFlagEl = document.querySelector(`.${JS_PREFIX}ProductFlag`);
  if (!productFlagEl) return;

  /**
   * Updates the flag with the updated text and css classes
   * @param {string} label The new text for the flag
   * @param {string} newClasses The css classes to apply to the flag
   */
  const updateFlag = (label, newClasses) => {
    // List of classes that are specific to a certain flag type
    const classesToRemove = [...productFlagEl.classList].filter(isFlagClass);
    productFlagEl.classList.remove(...classesToRemove);
    productFlagEl.classList.add(...newClasses.split(/\s+/g));
    productFlagEl.innerHTML = label;
  };

  // IF YOU UPDATE THIS
  // You must also update the corresponding liquid code for server-render
  // ./snippets/product-flag.liquid
  // Last call flag needs to take priority over other flags
  if (isOnSale) {
    updateFlag('Last Call', 'de-u-bgRed de-u-textWhite');
  } else if (product.tags.includes('Innovation')) {
    updateFlag('Innovation', 'de-u-bgLime de-u-textBlack');
  } else if (product.tags.includes('New_Release')) {
    updateFlag('New Release', 'de-u-bgBlue de-u-textWhite');
  } else {
    productFlagEl.classList.add(`${CSS_UTILITY_PREFIX}hidden`);
  }
};
