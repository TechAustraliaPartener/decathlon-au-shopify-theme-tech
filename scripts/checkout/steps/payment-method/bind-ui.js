import {
  billingAddressChoices,
  shipToLabel,
  shipToMap,
  loadingOverlay,
  loadingImage
} from './ui-elements';
import STATE from '../../state';
import { DELIVERY_METHODS } from '../../constants';
import { hideElements, elementExists } from '../../ui-helpers';

const bindUI = () => {
  hideElements([loadingOverlay, loadingImage]);
  if (STATE.deliveryMethod === DELIVERY_METHODS.PICKUP) {
    hideElements(billingAddressChoices);
    hideElements([shipToMap]);
    shipToLabel.innerHTML = 'Pickup at';
  } else {
    const sameBillingShippingAddress = document.getElementById(
      'checkout_different_billing_address_false'
    );
    if (elementExists(sameBillingShippingAddress)) {
      sameBillingShippingAddress.click();
    }
  }
};

export default bindUI;
