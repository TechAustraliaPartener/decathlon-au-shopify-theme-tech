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
  SHOP_ID: process.env.PROD_KEYS ? '13306287' : '17524727',
  STOREFRONT_API_KEY: process.env.PROD_KEYS
    ? 'f76765be5300c93b4689309b5a31e7eb'
    : '8e681070902104a65649736d6b1f7bd0'
};

export default config;
