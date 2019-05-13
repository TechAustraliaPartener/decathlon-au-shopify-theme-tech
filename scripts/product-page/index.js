import './buybox';
import { init as carouselInit, updateUI as updateCarouselUI } from './carousel';
import { init as carouselContextInit } from './carousel-context';
import {
  init as colorSwatchesInit,
  getState as getColorSwatchesState,
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
import { init as drawerInit } from './drawer';

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
};

/**
 * The handler for when an option is selected
 */
const onOptionSelect = () => {
  // @todo Remove for production
  console.log('New State', getCombinedState());
  // Keep the UI up to date
  updateUI(getCombinedState());
};

/**
 * Updates all Product page custom UI components
 *
 * @param {Object} state The UI state object
 */
const updateUI = state => {
  const { color, size } = state;

  /**
   * Only update the MasterSelect if both size & color have been set.
   * The MasterSelect `<select>` input uses variant IDs as its values.
   * We can only get a variant ID when we have both size & color.
   */
  if (color && size) {
    updateMasterSelectUI(state);
  }

  updateOptionStates(state);
  updateCarouselUI(state);
};

/**
 * Initialize
 */
const init = () => {
  sizeSwatchesInit();
  colorSwatchesInit();
  setUpListeners();
  updateUI(getCombinedState());
  reviewsInit();
  drawerInit();
  carouselInit();
  carouselContextInit();
  accordionInit();
};

init();
