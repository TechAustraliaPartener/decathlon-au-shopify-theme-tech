// @ts-check
import { JS_PREFIX, CSS_UTILITY_PREFIX, IS_HIDDEN_CLASS } from './constants';
import { createState } from '../utilities/create-state';

/**
 * @param {string} c
 */
const isFlagClass = c =>
  // IE doesn't support string#startsWith, so we are using a regex instead of polyfill
  c.match(new RegExp(`^${CSS_UTILITY_PREFIX}bg`)) ||
  c.match(new RegExp(`^${CSS_UTILITY_PREFIX}text(?:White|Black|Blue)`)) ||
  c.match(new RegExp(`^${CSS_UTILITY_PREFIX}hidden`));

/**
 * @typedef State
 * @property {Variant | null} variant
 * @property {boolean} isShown
 */

/** @type {State} */
const initialState = {
  isShown: true,
  variant: null
};

const state = createState(initialState);

/**
 * Updates product flags UI when variant changes
 * @param {Variant} variant
 */
export const onVariantSelect = variant => {
  state.updateState({ variant });
};

export const showProductFlags = () => {
  state.updateState({ isShown: true });
};

export const hideProductFlags = () => {
  state.updateState({ isShown: false });
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
const render = ({ variant, isShown }) => {
  const product = window.productJSON;

  const isOnSale = variant
    ? variant.compare_at_price > variant.price
    : product.compare_at_price > product.price;
  const productFlagEls = document.querySelectorAll(`.${JS_PREFIX}ProductFlag[data-flag="{ product.id }"]`);
  if (!productFlagEls) return;

  /**
   * Updates the flag with the updated text and css classes
   * @param {string | null} label The new text for the flag
   * @param {string} newClasses The css classes to apply to the flag
   */
  const updateFlag = (label, newClasses) =>
    productFlagEls.forEach(el => {
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
    updateFlag('Sale', 'de-u-bgRed de-u-textWhite');
  } else {
    updateFlag(null, ''); // The flag will hide
  }
};

state.onChange(render);
