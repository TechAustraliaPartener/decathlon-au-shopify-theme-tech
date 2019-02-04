import STATE from "./state";
import { CHECKOUT_STEPS } from './constants';
import contactInformation from './steps/contact-information';

const bindUI = () => {
  if (STATE.checkoutStep === CHECKOUT_STEPS.CONTACT_INFORMATION) {
    contactInformation.bindUI();
  }
};

export default bindUI;
