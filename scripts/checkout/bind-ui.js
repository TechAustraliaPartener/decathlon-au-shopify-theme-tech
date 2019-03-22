import STATE from './state';
import { CHECKOUT_STEPS } from './constants';
import contactInformation from './steps/contact-information';

const bindUI = () => {
  if (STATE.checkoutStep === CHECKOUT_STEPS.CONTACT_INFORMATION) {
    contactInformation.bindUI();
  }

  if (STATE.checkoutStep === CHECKOUT_STEPS.SHIPPING_METHOD) {
    if(STATE.deliveryMethod === 'ship') {
      document.getElementById('checkout_shipping_rate_id_parcelify-pickup-0_00').parentNode.parentNode.parentNode.style.display='none';
    }
  }

  if (STATE.checkoutStep === CHECKOUT_STEPS.PAYMENT_METHOD) {
    if(STATE.deliveryMethod === 'pickup') {
      document.querySelector('[data-different-billing-address]').style.display = "none";
      document.querySelector('[data-same-billing-address]').style.display = "none";
      document.querySelector('.review-block:nth-child(2) .review-block__label').innerHTML = "Pickup at";
      document.querySelector('.map').style.display = "none";
    }
  }

  if (STATE.checkoutStep === CHECKOUT_STEPS.THANK_YOU) {
    if(STATE.deliveryMethod === 'pickup') {
      document.querySelector('.map').style.display = 'none';
      const headings = document.querySelectorAll('h3');
      [].forEach.call(headings, function(heading) {
        if(heading.textContent === 'Shipping address') {
          heading.textContent = 'Pickup address';
        }
      });
    }
  }
};

export default bindUI;
