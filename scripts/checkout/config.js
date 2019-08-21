import { isDev } from '../utilities/env-utils';

/**
 * Several of the classes that might be referenced in this module come from
 * markup created on the server by Shopify. Hence, a class name like
 * `section__content` will not follow Cloud Four / Decathlon class
 * naming guidelines.
 */
const config = {
  PICKUP_SHIPPING_METHODS: ['shopify-Pickup-0.00'],
  PICKUP_SHIPPING_METHOD: 'shopify-Pickup-0.00',
  CLASSES: {
    ACTIVE_SHIPPICK_BTN: 'de-is-active',
    ACTIVE_PICKUP_LOCATION: 'js-de-active-location',
    DISABLED_BUTTON: 'js-de-BtnDisabled',
    SHIPPING_OPTIONS_CONTAINER: 'section__content'
  },
  COPY: {
    SHIPPING_ADDRESS_HEADING: 'Shipping address',
    PICKUP_ADDRESS_HEADING: 'Pickup address'
  },
  SHOP_ID: isDev ? '17524727' : '13306287'
};

export default config;
