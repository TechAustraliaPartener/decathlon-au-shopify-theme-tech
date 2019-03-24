import { DELIVERY_METHODS } from '../../constants';
import STATE from '../../state';
import { showElements, hideElements, elementExists } from '../../ui-helpers';
import {
  shipToggleBtn,
  pickupToggleBtn,
  deliveryElements,
  pickupContent,
  continueBtn
} from './ui-elements';

const updateUI = () => {
  // Capture the current selected delivery method
  const deliveryMethod = STATE.deliveryMethod;
  if (deliveryMethod === DELIVERY_METHODS.PICKUP) {
    hideElements(deliveryElements);
    showElements([pickupContent]);
    hideElements([continueBtn]);
    showElements([document.querySelector('.js-de-payment-continue')]);
    pickupToggleBtn.classList.add('js-de-active-pickship-btn');
    shipToggleBtn.classList.remove('js-de-active-pickship-btn');
    document.querySelector(
      '.section--shipping-address .section__header h2'
    ).textContent = 'Pickup information';
    if (
      elementExists(document.querySelector('#checkout_shipping_address_id'))
    ) {
      hideElements([
        document.querySelector('#checkout_shipping_address_id').parentNode
      ]);
    }
  }
  if (deliveryMethod === DELIVERY_METHODS.SHIP) {
    console.log('here...');
    shipToggleBtn.classList.add('js-de-active-pickship-btn');
    pickupToggleBtn.classList.remove('js-de-active-pickship-btn');
    showElements(deliveryElements);
    hideElements([pickupContent]);
    hideElements([document.querySelector('.js-de-payment-continue')]);
    showElements([continueBtn]);
    document.querySelector(
      '.section--shipping-address .section__header h2'
    ).textContent = 'Shipping address';
    if (
      elementExists(document.querySelector('#checkout_shipping_address_id'))
    ) {
      showElements([
        document.querySelector('#checkout_shipping_address_id').parentNode
      ]);
    }
  }
};

export default updateUI;
