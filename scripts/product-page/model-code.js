// @ts-check

import pushStockInfoToDataLayer from './datalayer-stock-info';
import { JS_PREFIX, IS_HIDDEN_CLASS } from './constants';
import {
  getModelCodeFromVariant,
  variants,
  getVariantOptions
} from './product-data';

const modelCodeEls = document.querySelectorAll(`.${JS_PREFIX}ModelCode`);
const modelCodeTextEls = document.querySelectorAll(`.${JS_PREFIX}ModelCode-text`);

export const onColorSelect = color => {
  const modelCode = getModelCodeFromVariant(
    variants.find(variant => getVariantOptions(variant).color === color)
  );

  if (modelCode) {
    // Update the model code in the UI
    modelCodeTextEls.forEach(modelCodeTextEl => {
      modelCodeTextEl.textContent = modelCode;
    });

    pushStockInfoToDataLayer(modelCode);

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
