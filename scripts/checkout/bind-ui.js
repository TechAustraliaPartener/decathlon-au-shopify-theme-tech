import STATE from './state';
import { CHECKOUT_STEPS } from './constants';
import contactInformation from './steps/contact-information';
import shippingMethod from './steps/shipping-method';
import paymentMethod from './steps/payment-method';
import thankYou from './steps/thank-you';
import stockProblems from './stock-problems';

const bindUI = () => {
  if (STATE.checkoutStep === CHECKOUT_STEPS.CONTACT_INFORMATION) {
    contactInformation.bindUI();
  }

  if (STATE.checkoutStep === CHECKOUT_STEPS.SHIPPING_METHOD) {
    shippingMethod.bindUI();
  }

  if (STATE.checkoutStep === CHECKOUT_STEPS.PAYMENT_METHOD) {
    paymentMethod.bindUI();
  }

  if (
    STATE.checkoutStep === CHECKOUT_STEPS.THANK_YOU ||
    (window.Shopify &&
      window.Shopify.Checkout &&
      window.Shopify.Checkout.isOrderStatusPage)
  ) {
    thankYou.bindUI();
  }

  if (STATE.checkoutPage === 'stock_problems') {
    stockProblems.bindUI();
  }
};

export default bindUI;
