import STATE from './state';
import { CHECKOUT_STEPS } from './constants';
import contactInformation from './steps/contact-information';
import shippingMethod from './steps/shipping-method';
import paymentMethod from './steps/payment-method';
import thankYou from './steps/thank-you';

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

  if (STATE.checkoutStep === CHECKOUT_STEPS.THANK_YOU) {
    thankYou.bindUI();
  }
};

export default bindUI;
