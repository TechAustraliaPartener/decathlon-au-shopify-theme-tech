// @ts-check
import { IS_ACTIVE_CLASS, JS_PREFIX } from './constants';
import $ from 'jquery';
import { availableVariants, getVariantOptions } from './product-data';
import { createState } from '../utilities/create-state';

const initialState = {
  color: null,
  selectedOption: null
};

const state = createState(initialState);

const CLICK_EVENT = 'click';

export const $Swatches = $(`.${JS_PREFIX}ColorSwatches`);

export const swatchOptionEls = document.querySelectorAll(
  `.${JS_PREFIX}ColorSwatches-option`
);
const $ColorSwatchesOptions = $(swatchOptionEls);
const $ColorInfo = $(`.${JS_PREFIX}ColorInfo`);

const updateColorUiState = selectedOption => {
  // Visually unselect all options
  $ColorSwatchesOptions.removeClass(IS_ACTIVE_CLASS);
  // Then visually select the current option
  $(selectedOption).addClass(IS_ACTIVE_CLASS);
};

export const selectFirstSwatch = () => {
  const firstAvailableVariant = availableVariants()[0];
  const color =
    firstAvailableVariant && getVariantOptions(firstAvailableVariant).color;
  const firstSwatch =
    (color && $ColorSwatchesOptions.toArray().find(el => el.value === color)) ||
    $ColorSwatchesOptions.get(0);
  if (firstSwatch) firstSwatch.click();
};

const render = ({ selectedOption, color }) => {
  // We need to update the selected color option UI state
  updateColorUiState(selectedOption);
  // We need to update the selected color text
  $ColorInfo.text(color);
};

state.onChange(render);

// change to callback
export const handleColorSelect = cb =>
  state.onChange(({ color }) => cb(color), state => [state.color]);

const onColorSelect = function() {
  state.updateState({
    // @todo Consider removing jQuery dependency
    // @ts-ignore
    color: $(this).val(),
    selectedOption: this
  });
};

const selectSingleColorOptions = () => {
  if ($ColorSwatchesOptions.length === 1) {
    $ColorSwatchesOptions[0].click();
  }
};

export const init = () => {
  $ColorSwatchesOptions.on(CLICK_EVENT, onColorSelect);
  selectSingleColorOptions();
};
