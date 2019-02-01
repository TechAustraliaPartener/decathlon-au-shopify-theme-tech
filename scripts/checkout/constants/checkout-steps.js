/**
 * These constants match up to the `Shopify.Checkout.step` values
 * @see https://help.shopify.com/en/themes/development/layouts/checkout#step-identification
 */

export default {
  CONTACT_INFORMATION: 'contact_information',
  SHIPPING_METHOD: 'shipping_method',
  PAYMENT_METHOD: 'payment_method',
  PROCESSING: 'processing', // Between payment page and thank you page
  REVIEW: 'review' // Optional step set in the Admin
};
