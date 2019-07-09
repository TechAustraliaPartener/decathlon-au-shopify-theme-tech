// @ts-check

import { getUIElements } from './init-ui';
import { UPDATE, USER_LOCATION_DATA_UPDATE, STORES_UPDATE } from './constants';
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

const { useGeolocationEl } = getUIElements();

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
  bindUseGeolocation();
};
