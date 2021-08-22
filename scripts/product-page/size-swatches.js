import $ from 'jquery';
import {
  IS_ACTIVE_CLASS,
  VALIDATION_MESSAGE_CLASS,
  JS_PREFIX,
  PRODUCT_PAGE_COPY,
  IS_HIDDEN_CLASS
} from './constants';
import { createState } from '../utilities/create-state';
import { getExistingSizesFromColor } from './product-data';

const initialState = {
  size: null,
  selectedOption: null,
  variant: null,
  color: null
};

const state = createState(initialState);

export const $swatches = $(`.${JS_PREFIX}SizeSwatches`);

export const swatchOptionEls = document.querySelectorAll(`.${JS_PREFIX}SizeSwatches-option`);
const validationTextEl = document.querySelector(`.${VALIDATION_MESSAGE_CLASS}`);
const stockMessageTextEl = document.querySelector('.js-de-stock-info-message .message');
const $sizeSwatchesOptions = $(swatchOptionEls);
const $sizeInfo = $(`.${JS_PREFIX}SizeInfo`);

const updateSizeUIState = selectedOption => {
  // Visually unselect all options then select current options
  $sizeSwatchesOptions.removeClass(IS_ACTIVE_CLASS);
  $(selectedOption).addClass(IS_ACTIVE_CLASS);
};

const render = ({ selectedOption, size, variant, color }) => {
  $swatches.toggleClass(
    IS_HIDDEN_CLASS,
    getExistingSizesFromColor(color).length === 1
  );
  updateSizeUIState(selectedOption);
  $sizeInfo.text(variant ? size : PRODUCT_PAGE_COPY.SELECT_A_SIZE);
};

state.onChange(render);

export const onColorSelect = color => {
  const existingSizes = getExistingSizesFromColor(color);
  // If there is only one size for the currently selected color, select that size
  if (existingSizes.length === 1) {
    const onlyApplicableSize = existingSizes[0];
    if (onlyApplicableSize !== state.getState().size) {
      const target = $sizeSwatchesOptions
        .filter((_index, el) => el.value === onlyApplicableSize)
        .get(0);
      onSizeSelect.bind(target)();
    }
  }
  state.updateState({ color });
};

// Change cb to callback
export const handleSizeSelect = (callback) => {
  state.onChange(({ size }) => callback(size), state => [state.size]);
}

const onSizeSelect = function() {
  state.updateState({
    // @ts-ignore
    size: $(this).val(),
    selectedOption: this
  });

  resetMissingSizeInfo();
};

export const onVariantSelect = variant => {
  state.updateState({ variant });
  resetMissingSizeInfo();
};

const showMissingSizeInfo = () => {
  if (validationTextEl) {
    validationTextEl.textContent = PRODUCT_PAGE_COPY.SELECT_A_SIZE;
  }

  if (stockMessageTextEl && stockMessageTextEl.textContent && validationTextEl.textContent !== '') {
    stockMessageTextEl.textContent = '';
  }
};

const resetMissingSizeInfo = () => {
  if (validationTextEl) {
    validationTextEl.textContent = '';
  }
};

export const handleAddToCartAttemptWithNoVariant = () => {
  // Can't add to cart if no size is selected
  showMissingSizeInfo();
};

export const init = () => {
  $sizeSwatchesOptions.on('click', onSizeSelect);
};
