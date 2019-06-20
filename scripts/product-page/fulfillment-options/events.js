// @ts-check

import { getUIElements } from './init-ui';
import {
  IS_HIDDEN_CLASS,
  UPDATE,
  USER_LOCATION_DATA_UPDATE,
  STORES_UPDATE
} from './constants';
import { fetchUserLocationData } from './api';
import { getAvailablePickupStores } from './services';
import { updateState, fulfillmentOptionsStateEmitter } from './state';
import {
  updateUserLocationUI,
  updateStoreInfo,
  showWaitingForLocation,
  hideWaitingForLocation,
  showLocationUpdateMessage,
  hideLocationUpdateMessage
} from './update-ui';

const {
  locationForm,
  locationFormInput,
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
      updateState({ userLocationData });
      hideWaitingForLocation();
    })
    .catch(error => {
      hideWaitingForLocation();
      console.error(error);
    });
};

/**
 * Handler for custom location form submission
 * @param {Event} event - The form submission event object
 */
const handleLocationFormSubmit = event => {
  // Prevents the form from refreshing the page
  event.preventDefault();
  // The user entered search value
  const queryValue = locationFormInput.value;
  // @TODO - Remove logs
  console.log('User location query: ', queryValue);
  // @TODO implement remaining work
};

/**
 * Handler for state update events
 * This will only be called when it's verified that state actually changed
 * (e.g., user's location object or store list changed)
 * @param {import('./state').StateUpdateEventObject} event - An event object
 */
const handleStateUpdate = event => {
  if (event.type === USER_LOCATION_DATA_UPDATE) {
    if (event.data.zipcode) {
      getAvailablePickupStores(event.data.zipcode)
        .then(stores => {
          if (stores && stores.length > 0) {
            updateState({ stores });
            /**
             * Update the user location in the UI
             * @TODO - Question - should this only happen after verifying
             * there are stores within range?
             */
            updateUserLocationUI(event.data);
          } else {
            showLocationUpdateMessage(event.data);
          }
        })
        .catch(error => console.error(error));
    }
  }
  if (event.type === STORES_UPDATE) {
    hideLocationUpdateMessage();
    updateStoreInfo(event.data);
  }
};

/**
 * Bind to the submit event of the location input form
 */
const bindLocationForm = () =>
  locationForm.addEventListener('submit', handleLocationFormSubmit);

/**
 * Bind to toggle showing the location input form
 */
const bindLocationInputToggle = () =>
  locationInputToggle.addEventListener('click', handleLocationInputToggle);

/**
 * Bind to the "Use My Location" button in the drawer
 */
const bindUseGeolocation = () =>
  useGeolocationEl.addEventListener('click', handleUseGeolocationClick);

/**
 * Bind to custom events emitted when module state is updated
 */
const bindStateUpdates = () =>
  fulfillmentOptionsStateEmitter.on(UPDATE, handleStateUpdate);

/**
 * Bind all event handlers for the module
 */
export const bindEventHandlers = () => {
  bindStateUpdates();
  bindLocationInputToggle();
  bindUseGeolocation();
  bindLocationForm();
};
