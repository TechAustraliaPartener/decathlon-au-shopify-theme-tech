// @ts-check

import './buybox';
import * as carousel from './carousel';
import * as carouselContext from './carousel-context';
import * as collapse from './collapse';
import * as colorSwatches from './color-swatches';
import * as sizeSwatches from './size-swatches';
import './videos';
import * as accordion from './accordion';
import pushStockInfoToDataLayer from './datalayer-stock-info';
import * as inventoryLocations from './inventory-locations';
import { reviewsInit } from './ratings-reviews';
import { updateOptionStates } from './option-states';
import * as masterSelect from './master-select';
import * as price from './price';
import * as modelCode from './model-code';
import * as productFlags from './product-flags';
import * as addToCart from './add-to-cart';
import * as drawer from './drawer';
import { getUrlVariant, updateUrlVariant } from './query-string';
import { getSelectedVariant, getVariantOptions } from './product-data';
import * as stickyNav from './sticky-nav';
import * as recentlyViewed from './recently-viewed';

// Removed for AU
// import * as storePickup from './fulfillment-options';
import * as modal from './modal';
import { createState } from '../utilities/create-state';

const updateFulfillmentOptionsUI = null;

/**
 * @typedef State
 * @property {string} [color]
 * @property {string} [size]
 */

const state = createState(/** @type {State} */ ({}));

/** @param {State} state */
const getVariantFromState = ({ color, size }) =>
  color && size && getSelectedVariant({ color, size });

/**
 * @param {State} state The current UI state
 */
const getComputedState = state => {
  return {
    color: state.color,
    size: state.size,
    variant: getVariantFromState(state)
  };
};

/**
 * Sets up listeners for custom UI components
 */
const setUpListeners = () => {
  sizeSwatches.handleSizeSelect(size => {
    state.updateState({ size });
  });
  colorSwatches.handleColorSelect(color => {
    state.updateState({ color });
  });
  addToCart.onVariantModification(() => {
    const fullState = getComputedState(state.getState());
    updateOptionStates(fullState);
  });
};

// When the variant changes
state.onChange(
  state => {
    const variant = getVariantFromState(state);
    addToCart.onVariantSelect(variant);
    productFlags.onVariantSelect(variant);
    sizeSwatches.onVariantSelect(variant);
    updateUrlVariant(variant && variant.id);
    if (variant) {
      // MasterSelect requires a full variant to update
      masterSelect.onVariantSelect(variant);
      // The updateFulfillmentOptionsUI function will be undefined on page load,
      // but will update on subsequent page actions
      updateFulfillmentOptionsUI && updateFulfillmentOptionsUI(state);
      window.vars.selectedVariant = variant;
      if (window.inventoryLocationsDisplay && window.inventories) {
        window.inventoryLocationsDisplay.changeVariant(variant.id);
      }
    } else {
      window.vars.selectedVariant = null;
      if (window.inventoryLocationsDisplay && window.inventories) {
        window.inventoryLocationsDisplay.changeVariant(null);
      }
    }
  },
  state => [getVariantFromState(state)]
);

// When the color changes
state.onChange(
  ({ color }) => {
    if (!color) return;
    sizeSwatches.onColorSelect(color);
    carousel.onColorSelect(color);
    // Model code can be updated without size
    modelCode.onColorSelect(color);
  },
  state => [state.color]
);

// When a swatch changes (color _or_ size)
state.onChange(
  state => {
    const { color, size } = state;
    const variant = getVariantFromState(state);
    updateOptionStates({ color, size, variant });
    // Price can be updated even if no variant (color + size) has been selected
    // @see: https://app.gitbook.com/@decathlonusa/s/shopify/product-feature/product-page#price
    price.onSwatchChange({ color, variant });
    if (window.vars.thresholdForGateways.afterpay.enabled && window.vars.thresholdForGateways.afterpay.threshold && variant) {
      displayPaymentGateway(variant.price, window.vars.thresholdForGateways.afterpay.threshold * 100, 'afterpay');
    }
    if (window.vars.thresholdForGateways.zipPay.enabled && window.vars.thresholdForGateways.zipPay.threshold && variant) {
      displayPaymentGateway(variant.price, window.vars.thresholdForGateways.zipPay.threshold * 100, 'zip-pay');
    }
  },
  state => [state.size, state.color]
);

/**
 * Updates UI to reflect variant in URL
 */
const selectUrlVariant = () => {
  const urlVariantId = Number(getUrlVariant());
  const variant = getSelectedVariant({ id: urlVariantId });
  if (variant) {
    const options = getVariantOptions(variant);
    const targetColorSwatch = [...colorSwatches.swatchOptionEls].find(
      swatch => swatch.value === options.color
    );
    const targetSizeSwatch = [...sizeSwatches.swatchOptionEls].find(
      swatch => swatch.value === options.size
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
  if (variant) return urlVariantId;
};

const displayPaymentGateway = function (price, threshold, gateway) {
  const dNoneClassName = 'de-u-hidden';
  $(`.product-${gateway}-info`).toggleClass(dNoneClassName, price < threshold);
  $(`.product-${gateway}-disabled-info`).toggleClass(dNoneClassName, price >= threshold);
}

/**
 * Initialize
 */
const init = async () => {
  sizeSwatches.init();
  colorSwatches.init();
  setUpListeners();
  reviewsInit();
  drawer.init();
  recentlyViewed.init();
  carousel.init();
  carouselContext.init();
  collapse.init();
  addToCart.init();
  accordion.init();
  const urlVariant = selectUrlVariant();
  stickyNav.init();
  modal.init();
  inventoryLocations.init();

  return urlVariant;

  // Removed for AU
  // Suggest leaving the async setup for fulfillment options to last
  // updateFulfillmentOptionsUI = await storePickup.init();
  /**
   * The updateFulfillmentOptionsUI function will be undefined in the master
   * updateUI function on page load, so call here as soon as it's defined
   */
  // if (urlVariant) updateFulfillmentOptionsUI({ id: urlVariant });
};

// Call the async init to return the Promise and log errors
init()
  .then(() => console.log('Product page initialized.'))
  .catch(error => console.error(error));
