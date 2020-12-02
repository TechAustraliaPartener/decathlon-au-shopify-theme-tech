import $ from 'jquery';
import { IS_ACTIVE_CLASS, JS_PREFIX } from './constants';
import { availableVariants, getVariantOptions } from './product-data';
import { createState } from '../utilities/create-state';

const initialState = {
  color: null,
  selectedOption: null
};

const state = createState(initialState);

export const $swatches = $(`.${JS_PREFIX}ColorSwatches`);

export const swatchOptionEls = document.querySelectorAll(`.${JS_PREFIX}ColorSwatches-option`);
const $colorSwatchesOptions = $(swatchOptionEls);
const $colorInfo = $(`.${JS_PREFIX}ColorInfo`);

const updateColorUIState = selectedOption => {
  // Visually unselect all options then select current options
  $colorSwatchesOptions.removeClass(IS_ACTIVE_CLASS);
  $(selectedOption).addClass(IS_ACTIVE_CLASS);
};

export const selectFirstSwatch = () => {
  const firstAvailableVariant = availableVariants()[0];
  const color = firstAvailableVariant && getVariantOptions(firstAvailableVariant).color;
  const firstSwatch =
    (color && $colorSwatchesOptions.toArray().find(el => el.value === color)) ||
    $colorSwatchesOptions.get(0);
  if (firstSwatch) {
    firstSwatch.click();
  }
};

const render = ({ selectedOption, color }) => {
  updateColorUIState(selectedOption);
  $colorInfo.text(color);
};

state.onChange(render);

export const handleColorSelect = (callback) => {
  state.onChange(({ color }) => callback(color), state => [state.color]);
}

const onColorSelect = function() {
  state.updateState({
    // @ts-ignore
    color: $(this).val(),
    selectedOption: this
  });
};

const selectSingleColorOptions = () => {
  if ($colorSwatchesOptions.length === 1) {
    $colorSwatchesOptions[0].click();
  }
};

export const init = () => {
  $colorSwatchesOptions.on('click', onColorSelect);
  selectSingleColorOptions();
};
