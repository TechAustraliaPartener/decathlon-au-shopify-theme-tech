/* eslint-disable capitalized-comments */
// @ts-check

import $ from 'jquery';
import './buybox';
import * as carouselSwiper from './carousel-swiper';
import * as carousel from './carousel';
import * as carouselContext from './carousel-context';
import * as collapse from './collapse';
import * as colorSwatches from './color-swatches';
import * as sizeSwatches from './size-swatches';
import './videos';
import * as accordion from './accordion';
import * as inventoryLocations from './inventory-locations';
import * as vueATC from './vue-add-to-cart';
import { reviewsInit } from './ratings-reviews';
import { updateOptionStates } from './option-states';
import * as masterSelect from './master-select';
import * as price from './price';
import * as modelCode from './model-code';
import * as productFlags from './product-flags';
import * as addToCart from './add-to-cart';
import * as drawer from './drawer';
import { getUrlVariant, updateUrlVariant } from './query-string';
import { getSelectedVariant, getVariantOptions, getModelCodeFromVariant, variants } from './product-data';
import * as stickyNav from './sticky-nav';
import * as recentlyViewed from './recently-viewed';
import * as faqs from './faqs';

// Removed for AU
// import * as storePickup from './fulfillment-options';
import * as modal from './modal';
import { createState } from '../utilities/create-state';

const updateFulfillmentOptionsUI = null;

const initialState = {
  color: null,
  size: null
}

const state = createState(initialState);

const getVariantFromState = ({ color, size }) =>
  color && size && getSelectedVariant({ color, size });

const getComputedState = state => {
  return {
    color: state.color,
    size: state.size,
    variant: getVariantFromState(state)
  };
};

const setUpListeners = () => {
  sizeSwatches.handleSizeSelect(size => {
    state.updateState({ size });
  });
  colorSwatches.handleColorSelect(color => {
    state.updateState({ color });
    displayRRPPrices(color);
  });
  addToCart.onVariantModification(() => {
    const fullState = getComputedState(state.getState());
    updateOptionStates(fullState);
  });
  // For triggering swatches UI update after inventory has been loaded
  document.addEventListener('tomitProductLoaded', function (e, data) {
    setTimeout(() => {
      const fullState = getComputedState(state.getState());
      updateOptionStates(fullState);
    }, 100);
  });
};

// Handles variant change
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
      if (window.vueATC) {
        window.vueATC.changeVariant(variant.id);
      }
      // Update BNPL payment snippet modal data
      if (window.updateInstalments) window.updateInstalments(variant.price);
    } else {
      window.vars.selectedVariant = null;
      if (window.inventoryLocationsDisplay && window.inventories) {
        window.inventoryLocationsDisplay.changeVariant(null);
      }
      if (window.vueATC) {
        window.vueATC.changeVariant(null);
      }
    }
  },
  state => [getVariantFromState(state)]
);

// Handles color change
state.onChange(
  ({ color }) => {
    if (!color) return;
    sizeSwatches.onColorSelect(color);
    carousel.onColorSelect(color);
    // Model code can be updated without size
    modelCode.onColorSelect(color);
    displayRRPPrices(color);
  },
  state => [state.color]
);

// Handles swatch change (color/size)
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

const displayRRPPrices = function (color) {
  const variant = variants.find(variant => getVariantOptions(variant).color === color);

  const variantModelCode = getModelCodeFromVariant(variant);
  const metafields = window.vars.rrpMetafields;
  const product = window.vars.productJSON;

  const productPriceEl = $('#product-rrp-price');

  if (!metafields || !metafields.rrp_prices) {
    productPriceEl.hide();
    return;
  }

  const rrpPriceObj = metafields.rrp_prices.find(rrp => rrp.modelcode === variantModelCode);
  console.log(rrpPriceObj);
  const rrpPriceData = rrpPriceObj && rrpPriceObj.PriceRRP ? parseInt(rrpPriceObj.PriceRRP, 10) : false;
  const rrpPrice = rrpPriceData > product.price ? (rrpPriceData / 100).toFixed(2) : false;

  rrpPrice ? function () {
    productPriceEl.text(`RRP*: ${'$' + rrpPrice}`);
    productPriceEl.show();
  }() : productPriceEl.hide();
}

const init = async () => {
  sizeSwatches.init();
  colorSwatches.init();
  setUpListeners();
  reviewsInit();
  recentlyViewed.init();
  carousel.init();
  carouselSwiper.init();
  carouselContext.init();
  collapse.init();
  addToCart.init();
  accordion.init();
  stickyNav.init();
  modal.init();
  vueATC.init();
  inventoryLocations.init();
  drawer.init();
  faqs.init();
  const urlVariant = selectUrlVariant();

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
  .then(() => {
    displayRRPPrices(state.getState().color);
    return console.log('Product page initialized.');
  })
  .catch(error => console.error(error));

//GOOGLE TRANSLATE
var TRANSLATE_API_KEY = 'AIzaSyAkXb918cp932bUuHutJiiGOH5yAIZttQM';
var SOURCE_LANGUAGE = '';
var TARGET_LANGUAGE = 'en';

function translateReview(text, parentEl, type) {
  $.ajax({
    method: 'GET',
    url: 'https://translation.googleapis.com/language/translate/v2',
    dataType: 'jsonp',
    data: {
      key: TRANSLATE_API_KEY,
      source: SOURCE_LANGUAGE,
      target: TARGET_LANGUAGE,
      q: text,
      format: 'html'
    },
    success: function(result) {
      if (!result.error) {
        console.log('CONTENTS: ' + result.data.translations[0].translatedText);
        parentEl.find('.review-' + type + '-translated').html(result.data.translations[0].translatedText);
        show_review(parentEl, 'original', 'translated');
        parentEl.addClass('translated');
      } else {
        console.log(result.error);
      }
    }
  });
}

$(document).on('click', '.btn-original', function (e) {
  e.preventDefault();
  var parentEl = $(this).closest('.de-CustomerReview');
  show_review(parentEl, 'translated', 'original');
});

$(document).on('click', '.btn-translated', function (e) {
  e.preventDefault();
  var parentEl = $(this).closest('.de-CustomerReview');
  var title = parentEl.find('.review-title-original').html();
  var body = parentEl.find('.review-body p').html();
  var answer = parentEl.find('.review-answer-original').html();

  if (!parentEl.hasClass('translated')) {
    translateReview(title, parentEl, 'title');
    translateReview(body, parentEl, 'body');
    translateReview(answer, parentEl, 'answer');
  } else {
    console.log('Already translated');
    show_review(parentEl, 'original', 'translated');
  }
});

function show_review(parentEl, h, s) {
  parentEl.find('.review-title-' + s).show();
  parentEl.find('.review-body-' + s).show();
  parentEl.find('.review-answer-' + s).show();
  parentEl.find('.review-title-' + h).hide();
  parentEl.find('.review-body-' + h).hide();
  parentEl.find('.review-answer-' + h).hide();
  parentEl.find('.btn-' + h).addClass('active');
  parentEl.find('.btn-' + s).removeClass('active');
}
