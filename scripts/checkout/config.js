import sharedConfig from '../shared/config';
const { PROD_HOSTNAME } = sharedConfig;
/**
 * Check for dev environment
 * @param {Array} values - Two possible values, the second being for production or fallback
 * @returns {*} - Either the first value if window.location.hostname exists and isn't prodction,
 * or the production value
 */
const ifDev = values =>
  window && window.location && !window.location.hostname.match(PROD_HOSTNAME)
    ? values[0]
    : values[1];

const config = {
  PICKUP_SHIPPING_METHODS: ['Shopify-pickup-0.00'],
  PICKUP_SHIPPING_METHOD: 'Shopify-pickup-0.00',
  CLASSES: {
    ACTIVE_SHIPPICK_BTN: 'js-de-active-pickship-btn',
    ACTIVE_PICKUP_LOCATION: 'js-de-active-location',
    DISABLED_BUTTON: 'js-de-BtnDisabled'
  },
  COPY: {
    SHIPPING_ADDRESS_HEADING: 'Shipping address',
    PICKUP_ADDRESS_HEADING: 'Pickup address'
  },
  SHOP_ID: ifDev(['17524727', '13306287']),
  STOREFRONT_API_KEY: ifDev([
    '8e681070902104a65649736d6b1f7bd0',
    '7a1e00b184619ef7021a29119803ecbc'
  ])
};

export default config;
