import { billingAddressChoices, shipToLabel, shipToMap } from './ui-elements';
import STATE from '../../state';
import { DELIVERY_METHODS } from '../../constants';
import { hideElements } from '../../ui-helpers';

const bindUI = () => {
  if (STATE.deliveryMethod === DELIVERY_METHODS.PICKUP) {
    hideElements(billingAddressChoices);
    hideElements([shipToMap]);
    shipToLabel.innerHTML = 'Pickup at';
  }
};

export default bindUI;
