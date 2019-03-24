/**
 * Note: If Shopify updates the `content_for_layout` Liquid drop,
 * there is the possiblity these selectors will fail. This is a known
 * risk we are taking.
 * @see https://help.shopify.com/en/themes/development/layouts/checkout/best-practices#dom-dependency-and-liquid-drops
 * @see https://docs.decathlon.us/shopify/-LSqQDiLEYzw_Jv4oueW/product-feature/untitled-2#shopify-plus-checkout-customization
 */
const SHOPIFY_UI_SELECTORS = {
  CONTINUE_BTN: '.step__footer__continue-btn',
  SHIPPING_ADDRESS_HEADER: '.section--shipping-address .section__header h2',
  DELIVERY_INPUTS: {
    addressInput: '[data-address-field="address1"]',
    cityInput: '[data-address-field="city"]',
    countryInput: '[data-address-field="country"]',
    provinceInput: '[data-address-field="province"]',
    zipInput: '[data-address-field="zip"]'
  },
  USER_ADDRESS_LIST: '#checkout_shipping_address_id',
  USER_FIRST_NAME: '#checkout_shipping_address_first_name',
  USER_LAST_NAME: '#checkout_shipping_address_last_name',
  USER_EMAIL: '#checkout_email'
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
  PICKUP_LOCATIONS: '.js-de-pickup-locations',
  PICKUP_LOCATION: '.js-de-pickup-location',
  ACTIVE_PICKUP_LOCATION: '.js-de-active-location',
  PICKUP_CONTINUE_BTN_CONTAINER: '.js-de-payment-continue-container',
  PICKUP_CONTINUE_BTN: '.js-de-payment-continue',
  MAP_IMAGE: '.js-de-pickup-location-map-img'
};

export default {
  ...SHOPIFY_UI_SELECTORS,
  ...CUSTOM_UI_SELECTORS
};
