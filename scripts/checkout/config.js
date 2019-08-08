import { isDev } from '../utilities/env-utils';

const config = {
  PICKUP_SHIPPING_METHODS: ['shopify-Pickup-0.00'],
  PICKUP_SHIPPING_METHOD: 'shopify-Pickup-0.00',
  CLASSES: {
    ACTIVE_SHIPPICK_BTN: 'de-is-active',
    ACTIVE_PICKUP_LOCATION: 'js-de-active-location',
    DISABLED_BUTTON: 'js-de-BtnDisabled'
  },
  COPY: {
    SHIPPING_ADDRESS_HEADING: 'Shipping address',
    PICKUP_ADDRESS_HEADING: 'Pickup address'
  },
  SHOP_ID: isDev ? '17524727' : '13306287'
};

export default config;
