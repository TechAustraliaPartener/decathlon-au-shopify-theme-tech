import {
  billingAddressChoices,
  shipToLabel,
  shipToMap,
  loadingOverlay,
  loadingImage
} from './ui-elements';
import STATE from '../../state';
import { DELIVERY_METHODS } from '../../constants';
import { hideElements } from '../../ui-helpers';

const bindUI = () => {
  hideElements([loadingOverlay, loadingImage]);
  if (STATE.deliveryMethod === DELIVERY_METHODS.PICKUP) {
    hideElements(billingAddressChoices);
    hideElements([shipToMap]);
    shipToLabel.innerHTML = 'Pickup at';
  } else {
    document.getElementById('checkout_different_billing_address_false').click();
  }
};

export default bindUI;
