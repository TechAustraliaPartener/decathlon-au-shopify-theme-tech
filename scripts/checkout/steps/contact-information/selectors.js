/**
 * Note: If Shopify updates the `content_for_layout` Liquid drop,
 * there is the possiblity these selectors will fail. This is a known
 * risk we are taking.
 * @see https://help.shopify.com/en/themes/development/layouts/checkout/best-practices#dom-dependency-and-liquid-drops
 * @see https://docs.decathlon.us/shopify/-LSqQDiLEYzw_Jv4oueW/product-feature/untitled-2#shopify-plus-checkout-customization
 */
const SHOPIFY_UI_SELECTORS = {
  CONTINUE_BTN: '.step__footer__continue-btn',
  DELIVERY_INPUTS: {
    addressInput: '[data-address-field="address1"]',
    cityInput: '[data-address-field="city"]',
    countryInput: '[data-address-field="country"]',
    provinceInput: '[data-address-field="province"]',
    zipInput: '[data-address-field="zip"]'
  }
};

/**
 * These CSS selectors are custom. You will find the UI elements
 * within the Checkout Liquid template. We have full control over them
 * as they do not preside inside of the `content_for_Layout` Liquid drop.
 */
const CUSTOM_UI_SELECTORS = {
  TOGGLE_SHIPPING: '.js-de-toggle-shipping',
  TOGGLE_PICKUP: '.js-de-toggle-pickup',
  PICKUP_CONTENT: '.js-de-pickup-content',
  STORE_INPUT: '[name="store"]'
};

export default {
  ...SHOPIFY_UI_SELECTORS,
  ...CUSTOM_UI_SELECTORS
};
