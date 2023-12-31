import {
  billingAddressChoices,
  shipToLabel,
  shipToMap,
  loadingOverlay,
  loadingImage,
  userAddress1,
  userAddress2,
  userCity,
  userZip
} from './ui-elements';
import STATE from '../../state';
import { DELIVERY_METHODS } from '../../constants';
import { hideElements, elementExists } from '../../ui-helpers';

console.log(STATE);

/**
 * Clear auto-filled billing address fields
 */
const clearBillingAddress = () => {
  const billingFields = [userAddress1, userAddress2, userCity, userZip];
  billingFields.forEach(field => {
    if (elementExists(field)) {
      field.value = '';
    }
  });
};

const bindUI = () => {
  hideElements([loadingOverlay, loadingImage]);
  const hasErrorInDiffBillingAddress = $('#section--billing-address__different .field__message--error').length > 0;

  if (STATE.deliveryMethod === DELIVERY_METHODS.PICKUP) {
    hideElements(billingAddressChoices);
    hideElements([shipToMap]);
    shipToLabel.innerHTML = 'Pickup at';
    const differentBillingShippingAddress = document.getElementById(
      'checkout_different_billing_address_true'
    );
    if (elementExists(differentBillingShippingAddress)) {
      differentBillingShippingAddress.click();
    }
  } else {
    const sameBillingShippingAddress = document.getElementById(
      'checkout_different_billing_address_false'
    );
    if (elementExists(sameBillingShippingAddress)) {

      if(!hasErrorInDiffBillingAddress) {
        sameBillingShippingAddress.click();
        clearBillingAddress();
      }

    }
  }
};

export default bindUI;
