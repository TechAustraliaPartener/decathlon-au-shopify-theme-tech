// @ts-check

/**
 * @typedef {Object} StateUpdateEventObject
 * @property {string} type - The type of event dispatched
 * @property {Object} data - The payload of the state
 */

import Mitt from 'mitt';
import { createState } from '../create-state';
import equal from 'fast-deep-equal';
import { UPDATE, STORES_UPDATE, USER_LOCATION_DATA_UPDATE } from './constants';

/**
 * Create a new event emitter
 * Use new to avoid TS checking error
 * @see https://github.com/developit/mitt/issues/92
 */
export const fulfillmentOptionsStateEmitter = new Mitt();

/**
 * Module for storing, updating, and retrieving store and user location data
 */
const {
  getState: getFulfillmentOptionState,
  updateState: updateFulfillmentOptionState
} = createState({
  stores: [],
  userLocationData: {}
});

/**
 * Dispatch an event when a state update has been submitted and a portion of
 * state has been verified to have changed
 * @param {StateUpdateEventObject} stateUpdateEventObject  - An update to
 * the existing state
 */
const emitStateUpdate = stateUpdateEventObject => {
  fulfillmentOptionsStateEmitter.emit(UPDATE, stateUpdateEventObject);
};

/**
 * Export the original getState from the `create-state` module
 */
export const getState = getFulfillmentOptionState;

/**
 * Wrapper for updating state
 * 1. Checks existing against new values
 * 2. Checks for what's passed and if it differs from existing state it
 *   a. Updates state using the function from the `create-state` module
 *   b. Emits an event with a `type` and `data`, which can be listened for
 *      to trigger UI updates
 * @param {Object} stateUpdate - An update to the existing state, which may or
 * may not differ from current values
 */
export const updateState = stateUpdate => {
  const { stores, userLocationData } = stateUpdate;
  const {
    stores: existingStores,
    userLocationData: existingUserLocationData
  } = getState();
  if (stores && !equal(stores, existingStores)) {
    updateFulfillmentOptionState({ stores });
    emitStateUpdate({ type: STORES_UPDATE, data: stores });
  }
  if (userLocationData && !equal(userLocationData, existingUserLocationData)) {
    updateFulfillmentOptionState({ userLocationData });
    emitStateUpdate({
      type: USER_LOCATION_DATA_UPDATE,
      data: userLocationData
    });
  }
};
