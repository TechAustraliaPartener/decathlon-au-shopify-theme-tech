import config from '../../config';

const { PICKUP_SHIPPING_METHODS } = config;

const CUSTOM_UI_SELECTORS = {
  PICKUP_SHIPPING_METHOD_BLOCKS: PICKUP_SHIPPING_METHODS.map(
    selector => `[data-shipping-method="${selector}"]`
  ),
  LOADING_OVERLAY: '.de-loading-overlay',
  LOADING_IMAGE: '.de-checkout-loader'
};

export default { CUSTOM_UI_SELECTORS };
