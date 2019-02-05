import {
  storeLocations,
  pickupToggleBtn,
  shipToggleBtn,
  continueBtn
} from './ui-elements';
import STATE from '../../state';
import { DELIVERY_METHODS } from '../../constants';
import updateUI from './update-ui';
import { enableInput } from '../../ui-helpers';

const bindUI = () => {
  storeLocations.forEach(store => {
    store.addEventListener('change', e => {
      STATE.pickupStore = e.target.value;

      // The "continue" button should be enabled if a store is selected.
      enableInput(continueBtn);
    });
  });

  /**
   * Bind the toggle buttons
   */
  pickupToggleBtn.addEventListener('click', event => {
    STATE.deliveryMethod = DELIVERY_METHODS.PICKUP;
    updateUI();
  });

  shipToggleBtn.addEventListener('click', event => {
    STATE.deliveryMethod = DELIVERY_METHODS.SHIP;
    updateUI();
  });
};

export default bindUI;
