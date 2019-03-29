import { shipToMap, loadingOverlay, loadingImage } from './ui-elements';
import STATE from '../../state';
import { DELIVERY_METHODS } from '../../constants';
import { hideElements } from '../../ui-helpers';

const bindUI = () => {
  hideElements([loadingOverlay, loadingImage]);
  if (STATE.deliveryMethod === DELIVERY_METHODS.PICKUP) {
    hideElements([shipToMap]);
    const headings = document.querySelectorAll('h3');
    [].forEach.call(headings, function(heading) {
      if (heading.textContent === 'Shipping address') {
        heading.textContent = 'Pickup address';
      }
    });
  }
};

export default bindUI;
