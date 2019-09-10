// @ts-check

/**
 * Color Swatches "component"
 */

import { IS_ACTIVE_CLASS, JS_PREFIX } from './constants';
// @todo Consider removing jQuery dependency
import $ from 'jquery';
import { availableVariants, getVariantOptions } from './product-data';
import { createState } from '../utilities/create-state';

/**
 * @typedef State
 * @property {string} [color]
 * @property {HTMLElement} [selectedOption]
 */

const state = createState(/** @type {State} */ ({}));

/**
 * Module-specific constants
 */
const CLICK_EVENT = 'click';

/**
 * Root element
 */
export const $Swatches = $(`.${JS_PREFIX}ColorSwatches`);

/** @type {NodeListOf<HTMLButtonElement>} */
export const swatchOptionEls = document.querySelectorAll(
  `.${JS_PREFIX}ColorSwatches-option`
);
const $ColorSwatchesOptions = $(swatchOptionEls);
const $ColorInfo = $(`.${JS_PREFIX}ColorInfo`);

/**
 * Updates the selected color UI state
 *
 * @param {Element} selectedOption The selected option HTML element
 */
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

/**
 * Handles UI updates for the Color Swatches component
 *
 * @param {State} state
 */
const render = ({ selectedOption, color }) => {
  // We need to update the selected color option UI state
  updateColorUiState(selectedOption);
  // We need to update the selected color text
  $ColorInfo.text(color);
};

state.onChange(render);

/** @param {(size: string) => void} cb */
export const handleColorSelect = cb =>
  state.onChange(({ color }) => cb(color), state => [state.color]);

/**
 * Handler for when a color choice is made
 *
 * @todo Consider removing jQuery dependency
 * @this {HTMLElement} The triggered color swatch option element
 */
const onColorSelect = function() {
  state.updateState({
    // @todo Consider removing jQuery dependency
    // @ts-ignore
    color: $(this).val(),
    selectedOption: this
  });
};

/**
 * Single color options are selected by default
 */
const selectSingleColorOptions = () => {
  if ($ColorSwatchesOptions.length === 1) {
    $ColorSwatchesOptions[0].click();
  }
};

/**
 * Initializes functionality by setting up event binding
 *
 * @todo Consider removing jQuery dependency
 */
export const init = () => {
  $ColorSwatchesOptions.on(CLICK_EVENT, onColorSelect);
  selectSingleColorOptions();
};
