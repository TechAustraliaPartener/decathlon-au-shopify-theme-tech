import { loadingOverlay, loadingImage } from './ui-elements';
import STATE from '../../state';
import SELECTORS from './selectors';
import { DELIVERY_METHODS } from '../../constants';
import { hideElements } from '../../ui-helpers';

const updateShippingMethod = () => {
  if (
    document.querySelector(`${SELECTORS.PICKUP_SHIPPING_METHOD} input`).checked
  ) {
    console.log('here2');
    const radios = document.querySelectorAll('.input-radio');
    const pickupMethod = document
      .querySelector(SELECTORS.PICKUP_SHIPPING_METHOD)
      .getAttribute('data-shipping-method');
    for (let i = 0, length = radios.length; i < length; i++) {
      const currentMethod = radios[i].value;
      console.log(currentMethod);
      if (pickupMethod !== currentMethod) {
        radios[i].checked = true;
        hideElements([document.querySelector('.review-block:nth-child(3)')]);
        break;
      }
    }
  }
};

const bindUI = () => {
  console.log(SELECTORS.PICKUP_SHIPPING_METHOD);
  hideElements([loadingOverlay, loadingImage]);
  if (STATE.deliveryMethod === DELIVERY_METHODS.SHIP) {
    hideElements([
      document.querySelector(SELECTORS.PICKUP_SHIPPING_METHOD).parentNode
    ]);
    document.querySelector('.content-box__row:nth-child(3)').style.borderTop =
      'none';
    if (document.querySelector(SELECTORS.PICKUP_SHIPPING_METHOD)) {
      updateShippingMethod();
    } else {
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          updateShippingMethod();
        });
      });

      const observerConfig = {
        childList: true
      };

      observer.observe(
        document.querySelector('.section__content'),
        observerConfig
      );
    }
  }
};

export default bindUI;
