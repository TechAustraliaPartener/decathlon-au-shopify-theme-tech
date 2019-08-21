const SHOPIFY_UI_SELECTORS = {
  BILLING_ADDRESS_CHOICES: {
    sameAsShipping: '[data-same-billing-address]',
    differentThanShipping: '[data-different-billing-address]'
  },
  SHIP_TO_LABEL: '.review-block:nth-child(2) .review-block__label',
  SHIP_TO_MAP: '.map',
  USER_ADDRESS_1: '#checkout_billing_address_address1',
  USER_ADDRESS_2: '#checkout_billing_address_address2',
  USER_CITY: '#checkout_billing_address_city',
  USER_ZIP: '#checkout_billing_address_zip'
};

export default SHOPIFY_UI_SELECTORS;
