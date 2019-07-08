// @ts-check
import { getSelectedVariant } from './product-data';
import { JS_PREFIX, CSS_UTILITY_PREFIX, IS_HIDDEN_CLASS } from './constants';

/**
 * @param {string} c
 */
const isFlagClass = c =>
  // IE doesn't support string#startsWith, so we are using a regex instead of polyfill
  c.match(new RegExp(`^${CSS_UTILITY_PREFIX}bg`)) ||
  c.match(new RegExp(`^${CSS_UTILITY_PREFIX}text(?:White|Black)`)) ||
  c.match(new RegExp(`^${CSS_UTILITY_PREFIX}hidden`));

/**
 * @typedef State
 * @property {Variant | null} variant
 * @property {boolean} isShown
 */

/** @type {State} */
let state = {
  isShown: true,
  variant: null
};

/**
 * Updates product flags UI when variant changes
 * @param {Object} options
 * @param {string} options.size The selected size option
 * @param {string} options.color The selected color option
 */
export const updateUI = ({ size, color }) => {
  state = { ...state, variant: getSelectedVariant({ size, color }) };
  rerender(state);
};

export const showProductFlags = () => {
  state = { ...state, isShown: true };
  rerender(state);
};

export const hideProductFlags = () => {
  state = { ...state, isShown: false };
  rerender(state);
};

/**
 * @param {Element} el
 * @param {string[]} classes
 */
const removeClasses = (el, ...classes) =>
  classes.forEach(c => el.classList.remove(c));

/**
 * @param {Element} el
 * @param {string[]} classes
 */
const addClasses = (el, ...classes) =>
  classes.forEach(c => el.classList.add(c));

/**
 * Updates the DOM to match the state
 * @param {State} state
 */
export const rerender = ({ variant, isShown }) => {
  const product = window.productJSON;

  const isOnSale = variant && variant.compare_at_price > variant.price;
  const productFlagEls = document.querySelectorAll(`.${JS_PREFIX}ProductFlag`);
  if (!productFlagEls) return;

  /**
   * Updates the flag with the updated text and css classes
   * @param {string | null} label The new text for the flag
   * @param {string} newClasses The css classes to apply to the flag
   */
  const updateFlag = (label, newClasses) =>
    [...productFlagEls].forEach(el => {
      const classesToRemove = [...el.classList].filter(isFlagClass);
      removeClasses(el, ...classesToRemove);
      if (newClasses) addClasses(el, ...newClasses.split(/\s+/g));
      if (!isShown || !label) el.classList.add(IS_HIDDEN_CLASS);
      el.innerHTML = label;
    });
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
    updateFlag(null, ''); // The flag will hide
  }
};
