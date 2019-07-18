// @ts-check
/**
 * Model code module
 *
 * Updates the product model code in the UI when a new variant is selected
 */

import { JS_PREFIX, IS_HIDDEN_CLASS } from './constants';
import {
  getModelCodeFromVariant,
  variants,
  getVariantOptions
} from './product-data';

// Cache the Model Code DOM elements and array
const modelCodeEls = document.querySelectorAll(`.${JS_PREFIX}ModelCode`);
const modelCodeTextEls = document.querySelectorAll(
  `.${JS_PREFIX}ModelCode-text`
);

/**
 * Updates the UI with the variant's model code
 *
 * @param {import('.').State} state
 */
export const updateUI = ({ variant, color }) => {
  const modelCode = getModelCodeFromVariant(
    variant ||
      variants.find(variant => getVariantOptions(variant).color === color)
  );

  if (modelCode) {
    // Update the model code in the UI
    modelCodeTextEls.forEach(modelCodeTextEl => {
      modelCodeTextEl.textContent = modelCode;
    });

    // Then make sure any hidden model code wrappers are shown
    modelCodeEls.forEach(modelCodeEl => {
      modelCodeEl.classList.remove(IS_HIDDEN_CLASS);
    });
  } else {
    // No need to show model code wrappers if no model code exists
    modelCodeEls.forEach(modelCodeEl => {
      modelCodeEl.classList.add(IS_HIDDEN_CLASS);
    });
  }
};
