import { pickupShippingMethods } from './ui-elements';
import STATE from '../../state';
import { DELIVERY_METHODS } from '../../constants';
import { hideElements } from '../../ui-helpers';

const bindUI = () => {
  if (STATE.deliveryMethod === DELIVERY_METHODS.SHIP) {
    hideElements(pickupShippingMethods);
  }
};

export default bindUI;
