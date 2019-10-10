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
  // Clear auto-filled billing address fields
  clearBillingAddress();
  hideElements([loadingOverlay, loadingImage]);
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
      sameBillingShippingAddress.click();
    }
  }
};

export default bindUI;
