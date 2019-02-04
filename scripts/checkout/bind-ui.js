import STATE from "./state";
import { CHECKOUT_STEPS } from './constants';
import contactInformation from './steps/contact-information';

const bindUI = () => {
  if (STATE.checkoutStep === CHECKOUT_STEPS.CONTACT_INFORMATION) {
    contactInformation.bindUI();
  }

  if (STATE.checkoutStep === CHECKOUT_STEPS.SHIPPING_METHOD) {
    // Bind the Shipping (Step 2) UI
  }
};

export default bindUI;
