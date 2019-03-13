import { DELIVERY_METHODS } from '../../constants';
import STATE from '../../state';
import {
  showElements,
  hideElements,
  disableInput,
  enableInput
} from '../../ui-helpers';
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
    pickupToggleBtn.classList.add('js-de-active-pickship-btn');
    shipToggleBtn.classList.remove('js-de-active-pickship-btn');
    // The "continue" button should be disabled until a store is chosen.
    if (STATE.pickupStore === null) {
      disableInput(continueBtn);
    }
  }
  if (deliveryMethod === DELIVERY_METHODS.SHIP) {
    shipToggleBtn.classList.add('js-de-active-pickship-btn');
    pickupToggleBtn.classList.remove('js-de-active-pickship-btn');
    showElements(deliveryElements);
    hideElements([pickupContent]);

    // The "continue" button should always be enabled when "Ship" is selected.
    enableInput(continueBtn);
  }
};

export default updateUI;
