/**
 * Model code module
 *
 * Updates the product model code in the UI when a new variant is selected
 */

import { JS_PREFIX, IS_HIDDEN_CLASS } from './constants';
import { getSelectedVariant, getModelCodeFromVariant } from './product-data';

// Cache the Model Code DOM elements and array
const modelCodeEls = document.querySelectorAll(`.${JS_PREFIX}ModelCode`);
const modelCodeElsArray = [...modelCodeEls];
const modelCodeTextEls = document.querySelectorAll(
  `.${JS_PREFIX}ModelCode-text`
);
const modelCodeTextElsArray = [...modelCodeTextEls];

/**
 * Updates the UI with the variant's model code
 *
 * @param {object} obj The state data object
 * @param {string} obj.size Value of the selected size option
 * @param {string} obj.color Value of the selected color option
 */
export const updateUI = ({ size, color }) => {
  const modelCode = getModelCodeFromVariant(
    getSelectedVariant({ size, color })
  );

  if (modelCode) {
    // Update the model code in the UI
    modelCodeTextElsArray.forEach(modelCodeTextEl => {
      modelCodeTextEl.textContent = modelCode;
    });

    // Then make sure any hidden model code wrappers are shown
    modelCodeElsArray.forEach(modelCodeEl => {
      modelCodeEl.classList.remove(IS_HIDDEN_CLASS);
    });
  } else {
    // No need to show model code wrappers if no model code exists
    modelCodeElsArray.forEach(modelCodeEl => {
      modelCodeEl.classList.add(IS_HIDDEN_CLASS);
    });
  }
};
