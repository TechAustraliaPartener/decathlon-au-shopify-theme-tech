// @ts-check

import {
  billingAddressChoices,
  shipToLabel,
  shipToMap,
  userAddress1,
  userAddress2,
  userCity,
  userZip
} from './ui-elements';
import STATE from '../../state';
import { DELIVERY_METHODS } from '../../constants';
import { hideElements, elementExists } from '../../../utilities/element-utils';
import { loadingOverlay, loadingImage } from '../../ui-elements';
import selectors from './selectors';

const {
  BILLING_ADDRESS_CHOICES: { sameAsShipping }
} = selectors;

let sameBillingShippingAddressInput = null;

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

/**
 * Set the billing address to match shipping. Run only if the user hasn't
 * selected pickup in store
 */
const setBillingSameAsShipping = () => {
  /** @type {HTMLInputElement} */
  sameBillingShippingAddressInput =
    sameBillingShippingAddressInput ||
    document.querySelector(`${sameAsShipping} [type="radio"]`);

  if (sameBillingShippingAddressInput) {
    sameBillingShippingAddressInput.click();
  }
};

const bindUI = () => {
  // Clear auto-filled billing address fields
  clearBillingAddress();
  hideElements([loadingOverlay, loadingImage]);
  if (STATE.deliveryMethod === DELIVERY_METHODS.PICKUP) {
    hideElements(billingAddressChoices);
    hideElements([shipToMap]);
    shipToLabel.innerHTML = 'Pickup at';
  } else {
    setBillingSameAsShipping();
    /**
     * Listen for a Shopify page change event due to 3rd-party tax calculations
     * in the payment step
     */
    document.addEventListener('page:change', setBillingSameAsShipping);
  }
};

export default bindUI;
