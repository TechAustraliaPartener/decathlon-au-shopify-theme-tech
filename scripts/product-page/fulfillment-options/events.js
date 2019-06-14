import { getUIElements } from './init-ui';
import { IS_HIDDEN_CLASS } from './constants';

const {
  locationInputToggle,
  customerLocationEl,
  useGeolocationEl
} = getUIElements();

const handleLocationInputToggle = () => {
  customerLocationEl.classList.toggle(IS_HIDDEN_CLASS);
};

const handleUseGeolocationClick = () => {
  // @TODO implement
  // @see store-finder/utilities/fetch-user-location
  // Will need to update the UI on success
  console.log('Use geolocation clicked!');
};

const bindLocationInputToggle = () =>
  locationInputToggle.addEventListener('click', handleLocationInputToggle);

const bindUseGeolocation = () =>
  useGeolocationEl.addEventListener('click', handleUseGeolocationClick);

export const bindEventHandlers = () => {
  bindLocationInputToggle();
  bindUseGeolocation();
};
