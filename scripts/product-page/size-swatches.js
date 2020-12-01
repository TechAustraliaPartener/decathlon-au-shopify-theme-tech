// @ts-check
import {
  IS_ACTIVE_CLASS,
  VALIDATION_MESSAGE_CLASS,
  JS_PREFIX,
  PRODUCT_PAGE_COPY,
  IS_HIDDEN_CLASS
} from './constants';
import $ from 'jquery';
import { createState } from '../utilities/create-state';
import { getExistingSizesFromColor } from './product-data';

const initialState = {
  size: null,
  selectedOption: null,
  variant: null,
  color: null
};

const state = createState(initialState);

const CLICK_EVENT = 'click';

export const $Swatches = $(`.${JS_PREFIX}SizeSwatches`);

export const swatchOptionEls = document.querySelectorAll(`.${JS_PREFIX}SizeSwatches-option`);

const validationTextEl = document.querySelector(`.${VALIDATION_MESSAGE_CLASS}`);

const $SizeSwatchesOptions = $(swatchOptionEls);
const $SizeInfo = $(`.${JS_PREFIX}SizeInfo`);

const updateSizeUiState = selectedOption => {
  // Visually unselect all options
  $SizeSwatchesOptions.removeClass(IS_ACTIVE_CLASS);
  // Then visually select the current option
  $(selectedOption).addClass(IS_ACTIVE_CLASS);
};

const render = ({ selectedOption, size, variant, color }) => {
  $Swatches.toggleClass(
    IS_HIDDEN_CLASS,
    getExistingSizesFromColor(color).length === 1
  );
  // We need to update the selected color option UI state
  updateSizeUiState(selectedOption);
  // We need to update the selected color text
  $SizeInfo.text(variant ? size : PRODUCT_PAGE_COPY.SELECT_A_SIZE);
};

state.onChange(render);

export const onColorSelect = color => {
  const existingSizes = getExistingSizesFromColor(color);
  // If there is only one size for the currently selected color, select that size
  if (existingSizes.length === 1) {
    const onlyApplicableSize = existingSizes[0];
    if (onlyApplicableSize !== state.getState().size) {
      const target = $SizeSwatchesOptions
        .filter((_index, el) => el.value === onlyApplicableSize)
        .get(0);
      onSizeSelect.bind(target)();
    }
  }
  state.updateState({ color });
};

// Change cb to callback
export const handleSizeSelect = cb =>
  state.onChange(({ size }) => cb(size), state => [state.size]);

const onSizeSelect = function() {
  state.updateState({
    // @todo Consider removing jQuery dependency
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
  $SizeSwatchesOptions.on(CLICK_EVENT, onSizeSelect);
};
