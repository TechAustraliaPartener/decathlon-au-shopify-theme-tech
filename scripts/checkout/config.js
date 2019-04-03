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
  STORE_BASE_URL: process.env.TESTING
    ? 'https://testing-decathlon-usa.myshopify.com'
    : 'https://www.decathlon.com',
  SHOP_ID: process.env.TESTING ? '17524727' : '13306287',
  STOREFRONT_API_KEY: process.env.TESTING
    ? '8e681070902104a65649736d6b1f7bd0'
    : 'f76765be5300c93b4689309b5a31e7eb'
};

export default config;
