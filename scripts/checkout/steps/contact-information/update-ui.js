import { DELIVERY_METHODS } from '../../constants';
import STATE from '../../state';
import { showElements, hideElements } from '../../ui-helpers';
import {
  shipToggleBtn,
  pickupToggleBtn,
  deliveryElements,
  pickupContent,
  continueBtn
} from './ui-elements';

const updateUI = () => {
  // Allow the Ship/Pickup buttons to show up
  showElements([shipToggleBtn, pickupToggleBtn]);

  // Capture the current selected delivery method
  const deliveryMethod = STATE.deliveryMethod;

  if (deliveryMethod === DELIVERY_METHODS.PICKUP) {
    hideElements(deliveryElements);
    showElements([pickupContent]);
    hideElements([continueBtn]);
    showElements([document.querySelector('.js-de-payment-continue')]);
    pickupToggleBtn.classList.add('js-de-active-pickship-btn');
    shipToggleBtn.classList.remove('js-de-active-pickship-btn');
  }
  if (deliveryMethod === DELIVERY_METHODS.SHIP) {
    shipToggleBtn.classList.add('js-de-active-pickship-btn');
    pickupToggleBtn.classList.remove('js-de-active-pickship-btn');
    showElements(deliveryElements);
    hideElements([pickupContent]);
    hideElements([document.querySelector('.js-de-payment-continue')]);
    showElements([continueBtn]);
  }
};

export default updateUI;
