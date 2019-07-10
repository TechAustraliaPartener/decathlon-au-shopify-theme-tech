// @ts-check
import './buybox';
import * as carousel from './carousel';
import * as carouselContext from './carousel-context';
import {
  init as colorSwatchesInit,
  getState as getColorSwatchesState,
  selectFirstSwatch as selectFirstColorSwatch,
  $ColorSwatches
} from './color-swatches';
import {
  init as sizeSwatchesInit,
  getState as getSizeSwatchesState,
  $SizeSwatches
} from './size-swatches';
import './videos';
import { init as accordionInit } from './accordion';
import { reviewsInit } from './ratings-reviews';
import { updateOptionStates } from './option-states';
import { updateUI as updateMasterSelectUI } from './master-select';
import { updateUI as updatePriceUI } from './price';
import * as modelCode from './model-code';
import * as productFlags from './product-flags';
import * as addToCart from './add-to-cart';
import { init as drawerInit } from './drawer';
import { getUrlVariant } from './query-string';
import { variantOptions, getSelectedVariant } from './product-data';
import { init as stickyInit } from './sticky-nav';
import { init as storePickupInit } from './fulfillment-options';

let updateFulfillmentOptionsUI = null;

/**
 * Helper to get all of the child component states
 *
 * @returns {Object} The current UI state
 */
const getCombinedState = () => ({
  ...getColorSwatchesState(),
  ...getSizeSwatchesState()
});

/**
 * Sets up listeners for custom UI components
 */
const setUpListeners = () => {
  $SizeSwatches.on('SizeSwatches:select', onOptionSelect);
  $ColorSwatches.on('ColorSwatches:select', onOptionSelect);
  addToCart.onVariantModification(() => updateUI(getCombinedState()));
};

/** @type {Variant | null} */
let prevVariant = null;

/**
 * The handler for when an option is selected
 */
const onOptionSelect = () => {
  // @todo Remove for production
  console.log('New State', getCombinedState());
  // Keep the UI up to date
  updateUI(getCombinedState());
  const newVariant = getSelectedVariant(getCombinedState());
  const variantHasChanged =
    (prevVariant && prevVariant.id) !== (newVariant && newVariant.id);
  if (newVariant && variantHasChanged) {
    addToCart.onVariantSelect(newVariant);
    productFlags.onVariantSelect(newVariant);
  }
  prevVariant = newVariant;
};

/**
 * Updates all Product page custom UI components
 *
 * @param {Object} state The UI state object
 */
const updateUI = state => {
  const { color, size } = state;

  // Model code can be updated without size
  modelCode.updateUI(state);

  /**
   * Update the MasterSelect and UI displays if both size & color have been set.
   * The MasterSelect `<select>` input uses variant IDs as its values.
   * We can only get a variant ID when we have both size & color.
   */
  if (color && size) {
    updateMasterSelectUI(state);
    updatePriceUI(state);
    /**
     * The updateFulfillmentOptionsUI function will be undefined on page load,
     * but will update on subsequent page actions
     */
    updateFulfillmentOptionsUI && updateFulfillmentOptionsUI(state);
  }

  updateOptionStates(state);
  carousel.updateUI(state);
};

/**
 * Updates UI to reflect variant in URL
 */
const selectUrlVariant = () => {
  const urlVariant = getUrlVariant();
  if (urlVariant) {
    const activeOptions = variantOptions(urlVariant);
    /** @type {HTMLElement} */
    const targetColorSwatch = document.querySelector(
      `.js-de-ColorSwatches-option[value='${activeOptions.color}']`
    );
    /** @type {HTMLElement} */
    const targetSizeSwatch = document.querySelector(
      `.js-de-SizeSwatches-option[value='${activeOptions.size}']`
    );
    if (targetColorSwatch) {
      targetColorSwatch.click();
    }
    if (targetColorSwatch) {
      targetSizeSwatch.click();
    }
  } else {
    selectFirstColorSwatch();
  }
  return urlVariant;
};

/**
 * Initialize
 */
const init = async () => {
  sizeSwatchesInit();
  colorSwatchesInit();
  setUpListeners();
  reviewsInit();
  drawerInit();
  carousel.init();
  carouselContext.init();
  addToCart.init();
  accordionInit();
  const urlVariant = selectUrlVariant();
  stickyInit();
  // Suggest leaving the async setup for fulfillment options to last
  updateFulfillmentOptionsUI = await storePickupInit();
  /**
   * The updateFulfillmentOptionsUI function will be undefined in the master
   * updateUI function on page load, so call here as soon as it's defined
   */
  if (urlVariant) updateFulfillmentOptionsUI({ id: urlVariant });
  /**
   * Keep `updateUI()` last allowing all other initializations first
   */
  updateUI(getCombinedState());
};

// Call the async init to return the Promise and log errors
init()
  .then(() => console.log('Product page initialized.'))
  .catch(error => console.error(error));
