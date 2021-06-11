import { loadingOverlay, loadingImage } from './ui-elements';
import STATE from '../../state';
import SELECTORS from './selectors';
import { DELIVERY_METHODS } from '../../constants';
import { hideElements, elementExists } from '../../ui-helpers';

const updateShippingMethod = () => {
  if (
    elementExists(
      document.querySelector(`${SELECTORS.PICKUP_SHIPPING_METHOD} input`)
    ) &&
    document.querySelector(`${SELECTORS.PICKUP_SHIPPING_METHOD} input`).checked
  ) {
    const radios = document.querySelectorAll('.input-radio');
    const pickupMethod = document
      .querySelector(SELECTORS.PICKUP_SHIPPING_METHOD)
      .getAttribute('data-shipping-method');
    for (let i = 0, length = radios.length; i < length; i++) {
      const currentMethod = radios[i].value;
      if (pickupMethod !== currentMethod) {
        radios[i].checked = true;
        hideElements([document.querySelector('.review-block:nth-child(3)')]);
        break;
      }
    }
  }
  if (document.querySelector(SELECTORS.PICKUP_SHIPPING_METHOD)) {
    hideElements([
      document.querySelector(SELECTORS.PICKUP_SHIPPING_METHOD).parentNode
    ]);
  }
  //
  // document.querySelector('.content-box__row:nth-child(3)').style.borderTop =
  //  'none';
};

const hideShippingMethods = () => {
  const radios = document.querySelectorAll('.radio-wrapper');
  const pickupMethod = document
    .querySelector(SELECTORS.PICKUP_SHIPPING_METHOD)
    .getAttribute('data-shipping-method');

  for (let i = 0, length = radios.length; i < length; i++) {
    const currentMethod = radios[i].getAttribute('data-shipping-method');
    if (pickupMethod !== currentMethod) {
      radios[i].parentNode.style.display = 'none';
      radios[i].parentNode.remove();
    } else {
      radios[i].querySelector('input').checked = true;
    }
  }
};

const selectFirstVisibleRate = () => {
  const radios = document.querySelectorAll('.radio-wrapper');
  const radiosArray = Array.prototype.slice.call(radios);
  const anyChecked = radiosArray.map(r => r.querySelector('input').checked).some(c => c === true);
  if (!anyChecked && radiosArray[0]) {
    radiosArray[0].querySelector('input').checked = true;
  }
}

window.selectFirstVisibleRate = selectFirstVisibleRate;

const bindUI = () => {
  hideElements([loadingOverlay, loadingImage]);

  if (STATE.deliveryMethod === DELIVERY_METHODS.SHIP) {
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
  } else if (document.querySelector(SELECTORS.PICKUP_SHIPPING_METHOD)) {
    hideShippingMethods();
  } else {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        hideShippingMethods();
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
};

export default bindUI;
