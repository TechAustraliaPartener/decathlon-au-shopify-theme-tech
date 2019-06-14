import { getUIElements } from './init-ui';
import { IS_HIDDEN_CLASS } from './constants';
import { fetchUserLocationData } from './api';
import {
  updateUserLocationUI,
  showWaitingForLocation,
  hideWaitingForLocation
} from './update-ui';

const {
  locationInputToggle,
  customerLocationEl,
  useGeolocationEl
} = getUIElements();

/**
 * Toggles the visibility of the input/form for allowing a user to put in their
 * own location (zip or city/state)
 */
const handleLocationInputToggle = () => {
  customerLocationEl.classList.toggle(IS_HIDDEN_CLASS);
};

/**
 * Bind the Use My Location button. If the user isn't already using geolocation,
 * a prompt will be shown to allow. If location info is retrieved, update the
 * location info in the drawer
 */
const handleUseGeolocationClick = () => {
  showWaitingForLocation();
  return fetchUserLocationData({
    useGeolocation: true
  })
    .then(userLocationData => {
      updateUserLocationUI(userLocationData);
      hideWaitingForLocation();
    })
    .catch(error => {
      hideWaitingForLocation();
      console.error(error);
    });
};

const bindLocationInputToggle = () =>
  locationInputToggle.addEventListener('click', handleLocationInputToggle);

const bindUseGeolocation = () =>
  useGeolocationEl.addEventListener('click', handleUseGeolocationClick);

export const bindEventHandlers = () => {
  bindLocationInputToggle();
  bindUseGeolocation();
};
