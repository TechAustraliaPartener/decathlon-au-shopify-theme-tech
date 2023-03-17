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
const $variantSelect = $('#productSelectProxy');
const $sizeInfo = $(`.${JS_PREFIX}SizeInfo`);

const updateSizeUIState = selectedOption => {
  // Visually unselect all options then select current options
  $variantSelect.removeClass(IS_ACTIVE_CLASS);
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

// export const onColorSelect = color => {
//   const existingSizes = getExistingSizesFromColor(color);
//   // If there is only one size for the currently selected color, select that size
//   if (existingSizes.length === 1) {
//     const onlyApplicableSize = existingSizes[0];
//     if (onlyApplicableSize !== state.getState().size) {
//       const target = $variantSelect
//         .filter((_index, el) => el.value === onlyApplicableSize)
//         .get(0);
//       onSizeSelect.bind(target)();
//     }
//   }
//   state.updateState({ color });
// };

// Change cb to callback
export const handleVariantSelect = (callback) => {
  state.onChange((state) => {

    console.log('handleVariantSelect', state);
    if(state.size && state.color) {
      callback(state)
    }
  }, state => [state.size, state.color]);
}

const onVariantSelectChange = function() {
  const selectedVariantValue = $(this).val();
  const selectedVariant = window.vars.productJSON.variants.find((variant) => {
    return variant.id == selectedVariantValue
  });
  const [selectedSize, selectedColor] = selectedVariant.options;
  const size = selectedSize.trim();
  const color = selectedColor.trim();

  console.log('vs onVariantSelect', product.variants)
  console.log('vs onVariantSelect', selectedVariant)

  // state.updateState({ variant });
  state.updateState({
    // @ts-ignore
    size: size,
    color: color,
    // selectedOption: this
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
  console.log('init variant select...')
  $variantSelect.on('change', onVariantSelectChange);
};
