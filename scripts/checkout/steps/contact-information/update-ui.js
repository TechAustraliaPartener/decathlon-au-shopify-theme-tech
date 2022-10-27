import { DELIVERY_METHODS } from '../../constants';
import STATE from '../../state';
import SELECTORS from './selectors';
import { showElements, hideElements } from '../../ui-helpers';
import {
  shipToggleBtn,
  pickupToggleBtn,
  deliveryElements,
  pickupContent,
  continueBtn,
  shippingAddressHeader,
  userAddressList
} from './ui-elements';
import config from '../../config';

const { CLASSES, COPY } = config;

const updateUI = () => {
  // Capture the current selected delivery method
  const deliveryMethod = STATE.deliveryMethod;

  $('[data-address-field="company"]').show();
  shipToggleBtn.classList.add(CLASSES.ACTIVE_SHIPPICK_BTN);
  pickupToggleBtn.classList.remove(CLASSES.ACTIVE_SHIPPICK_BTN);
  hideElements([pickupContent]);
  hideElements([document.querySelector(SELECTORS.PICKUP_CONTINUE_BTN)]);
  showElements(deliveryElements);
  showElements([continueBtn, shippingAddressHeader, userAddressList]);
  shippingAddressHeader.textContent = COPY.SHIPPING_ADDRESS_HEADING;
};

export default updateUI;
