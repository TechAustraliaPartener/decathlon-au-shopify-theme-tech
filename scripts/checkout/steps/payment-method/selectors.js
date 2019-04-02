const SHOPIFY_UI_SELECTORS = {
  BILLING_ADDRESS_CHOICES: {
    sameAsShipping: '[data-same-billing-address]',
    differentThanShipping: '[data-different-billing-address]'
  },
  SHIP_TO_LABEL: '.review-block:nth-child(2) .review-block__label',
  SHIP_TO_MAP: '.map',
  LOADING_OVERLAY: '.de-loading-overlay',
  LOADING_IMAGE: '.de-checkout-loader'
};

export default SHOPIFY_UI_SELECTORS;
