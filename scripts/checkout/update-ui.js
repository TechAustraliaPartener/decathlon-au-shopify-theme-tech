import STATE from "./state";
import { CHECKOUT_STEPS } from './constants';
import contactInformation from "./steps/contact-information";

const updateUI = () => {
  if (STATE.checkoutStep === CHECKOUT_STEPS.CONTACT_INFORMATION) {
    contactInformation.updateUI();
  }

  if (STATE.checkoutStep === CHECKOUT_STEPS.SHIPPING_METHOD) {
    // Update Shipping (Step 2) UI
  }
};

export default updateUI;
