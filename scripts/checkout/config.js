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
  PICKUP_SHIPPING_METHODS: [
    'Parcelify-decathlon%20san%20francisco%20store%20pickup-0.00'
  ],
  PICKUP_SHIPPING_METHOD:
    'Parcelify-decathlon%20san%20francisco%20store%20pickup-0.00',
  CLASSES: {
    ACTIVE_SHIPPICK_BTN: 'js-de-active-pickship-btn',
    ACTIVE_PICKUP_LOCATION: 'js-de-active-location'
  },
  COPY: {
    SHIPPING_ADDRESS_HEADING: 'Shipping address',
    PICKUP_ADDRESS_HEADING: 'Pickup address'
  },
  SHOP_ID: ifDev(['17524727', '13306287']),
  STOREFRONT_API_KEY: ifDev([
    '8e681070902104a65649736d6b1f7bd0',
    'f76765be5300c93b4689309b5a31e7eb'
  ])
};

export default config;
