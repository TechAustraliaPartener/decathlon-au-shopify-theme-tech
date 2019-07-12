// @ts-check

// this manual import is needed because we are not using Array.from directly,
// but core-js is using it, and we aren't automatically injecting polyfills for core-js's own files,
// otherwise we'd have circular dependency issues
import 'core-js/modules/es.array.from';
import './buybox';
import * as carousel from './carousel';
import * as carouselContext from './carousel-context';
import * as colorSwatches from './color-swatches';
import * as sizeSwatches from './size-swatches';
import './videos';
import * as accordion from './accordion';
import { reviewsInit } from './ratings-reviews';
import { updateOptionStates } from './option-states';
import * as masterSelect from './master-select';
import * as price from './price';
import * as modelCode from './model-code';
import * as productFlags from './product-flags';
import * as addToCart from './add-to-cart';
import * as drawer from './drawer';
import { getUrlVariant, updateUrlVariant } from './query-string';
import { variantOptions, getSelectedVariant } from './product-data';
import * as stickyNav from './sticky-nav';
import * as storePickup from './fulfillment-options';

let updateFulfillmentOptionsUI = null;

/**
 * @typedef State
 * @property {string | undefined} color
 * @property {string | undefined} size
 * @property {Variant | undefined} variant
 */

/**
 * Helper to get all of the child component states
 *
 * @returns {State} The current UI state
 */
const getCombinedState = () => {
  const color = colorSwatches.getSelected();
  const size = sizeSwatches.getSelected();
  return {
    color,
    size,
    variant: color && size && getSelectedVariant({ color, size })
  };
};

/**
 * Sets up listeners for custom UI components
 */
const setUpListeners = () => {
  sizeSwatches.$Swatches.on('SizeSwatches:select', onOptionSelect);
  colorSwatches.$Swatches.on('ColorSwatches:select', onOptionSelect);
  addToCart.onVariantModification(() => updateUI(getCombinedState()));
};

/** @type Variant | null | undefined */
let prevVariant;

/** @type string | null | undefined */
let prevColor;

/**
 * The handler for when an option is selected
 */
const onOptionSelect = () => {
  const combinedState = getCombinedState();
  // @todo Remove for production
  console.log('New State', combinedState);
  // Keep the UI up to date
  updateUI(combinedState);
  const newVariant = getSelectedVariant(combinedState);
  const variantHasChanged =
    (prevVariant && prevVariant.id) !== (newVariant && newVariant.id);
  if (variantHasChanged) {
    addToCart.onVariantSelect(newVariant);
    productFlags.onVariantSelect(newVariant);
    sizeSwatches.onVariantSelect(newVariant);
  }
  const color = combinedState.color;
  if (color !== prevColor) {
    sizeSwatches.onColorSelect(color);
  }
  prevVariant = newVariant;
  prevColor = color;
};

/**
 * Updates all Product page custom UI components
 *
 * @param {State} state The UI state object
 */
const updateUI = state => {
  // Model code can be updated without size
  modelCode.updateUI(state);

  updateUrlVariant(state.variant && state.variant.id);

  if (state.variant) {
    // MasterSelect requires a full variant to update
    masterSelect.updateUI(state);
    // Price currently only gets updated if there is a full variant selected
    // @TODO: Should this be updated even if there is no complete variant? To what?
    price.updateUI(state);
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
  const urlVariant = Number(getUrlVariant());
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
    colorSwatches.selectFirstSwatch();
  }
  return urlVariant;
};

/**
 * Initialize
 */
const init = async () => {
  sizeSwatches.init();
  colorSwatches.init();
  setUpListeners();
  reviewsInit();
  drawer.init();
  carousel.init();
  carouselContext.init();
  addToCart.init();
  accordion.init();
  const urlVariant = selectUrlVariant();
  stickyNav.init();
  // Suggest leaving the async setup for fulfillment options to last
  updateFulfillmentOptionsUI = await storePickup.init();
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
