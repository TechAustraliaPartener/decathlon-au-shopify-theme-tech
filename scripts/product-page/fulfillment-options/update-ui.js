// @ts-check

import { IS_HIDDEN_CLASS, REMOVE, ADD } from './constants';
import {
  buildStoreTile,
  setClosestStoreInfo,
  updateProductInDrawer
} from './build-ui';
import { getAvailableSelectedVariant } from '../product-data';
import { getUIElements } from './init-ui';
import { getState } from './state';

/**
 * Toggle the pickup option details (closest store for pickup) and the message
 * that prompts for product variant selections before showing a pickup store
 * @param {boolean} [show] - Whether to show or hide pickup details, also
 * toggles display of the select product options message, which should show when
 * pickup details are hidden, or vice versa
 */
const setPickupStoreDetailsVisibility = (show = true) => {
  const {
    storePickupDetailsEl,
    pickupDayEl,
    selectForPickupOptionsMessageEl
  } = getUIElements();
  const storeInfoClassListAction = show ? REMOVE : ADD;
  const productSelectionClassListAction = show ? ADD : REMOVE;
  // Toggle store pickup details
  storePickupDetailsEl.classList[storeInfoClassListAction](IS_HIDDEN_CLASS);
  // Toggle the pickup day
  pickupDayEl.classList[storeInfoClassListAction](IS_HIDDEN_CLASS);
  // Toggle the select product options message, the reverse of store pickup details
  selectForPickupOptionsMessageEl.classList[productSelectionClassListAction](
    IS_HIDDEN_CLASS
  );
};

/**
 * Show pickup store details and hide a message to select a valid product
 * variant
 */
const showPickupStoreDetails = () => setPickupStoreDetailsVisibility(true);

/**
 * Hide pickup store details and show a message to select a valid product
 * variant
 */
const hidePickupStoreDetails = () => setPickupStoreDetailsVisibility(false);

/**
 * Toggle the fulfillment (store pickup) options block
 * @param {boolean} [show] - Set to true to hide pickup options
 */
const setPickupOptionVisibility = (show = true) => {
  const { storePickupOptionsEl } = getUIElements();
  const classListAction = show ? REMOVE : ADD;
  storePickupOptionsEl.classList[classListAction](IS_HIDDEN_CLASS);
};

/**
 * Show the fulfillment (store pickup) options block
 */
const showPickupOption = () => setPickupOptionVisibility(true);

/**
 * Hide the fulfillment (store pickup) options block
 */
const hidePickupOption = () => setPickupOptionVisibility(false);

/**
 * Update the user location portion of the drawer
 * @param {import('./api').UserLocationData} userLocationData
 */
export const updateUserLocationUI = ({ stateCode, city }) => {
  const { userLocationCityEl, userLocationStateEl } = getUIElements();
  if (stateCode) {
    userLocationStateEl.innerText = stateCode;
  }
  if (city) {
    userLocationCityEl.innerText = city;
  }
};

/**
 * Update store list in drawer, at or after module initialization
 * @param {Object[]} stores - An array of one or more store objects
 */
export const updateStoreList = stores => {
  const { storeTileListEl } = getUIElements();
  storeTileListEl.innerHTML = buildStoreTile(stores);
};

/**
 * @TODO - Implement a helper function that toggles a message in the drawer
 * if an updated location is
 * 1. Too far from stores
 * 2. Invalid
 */

/**
 * Update closest store information in buybox, at or after module
 * initialization
 * @param {Object[]} stores - An array of one or more store objects
 */
export const updateClosestStore = stores => {
  // Get the first store (they are sorted closest first)
  const closestStore = stores[0];
  // If there is no pickup store within range, hide the pickup option and return
  if (!closestStore) {
    /**
     * @TODO - Determine whether this function should stay
     * There seems to be no reason to re-hide the pickup option block if it
     * was shown on page load, even if the user changes location within
     * the drawer. Saving for the moment.
     */
    hidePickupOption();
    return;
  }
  setClosestStoreInfo(closestStore);
  /**
   * Show the pickup options block (Showing store details is controlled by
   * swatch selection)
   */
  showPickupOption();
};

/**
 * Update store information in both buybox and drawer, at or after module
 * initialization
 * @param {Object[]} stores - An array of one or more store objects
 */
export const updateStoreInfo = stores => {
  updateStoreList(stores);
  updateClosestStore(stores);
};

/**
 * Toggle the Use My Location button to show "waiting" text
 * @param {boolean} [hide] - Whether to hide the waiting version and show the
 * Use My Location button again
 */
export const showWaitingForLocation = hide => {
  const useGeolocationAction = hide ? 'remove' : 'add';
  const waitingForLocationAction = hide ? 'add' : 'remove';
  const { useMyLocationTextEl, loadingLocationTextEl } = getUIElements();
  useMyLocationTextEl.classList[useGeolocationAction](IS_HIDDEN_CLASS);
  loadingLocationTextEl.classList[waitingForLocationAction](IS_HIDDEN_CLASS);
};

export const hideWaitingForLocation = () => showWaitingForLocation(true);

/**
 * Update product fulfillment (store pickup) drawer UI elements
 *
 * @param {Object} params The Decathlon stores and user's location
 * @param {Array} params.stores A collection of store data
 * @param {import('./api').UserLocationData} params.userLocationData
 * @param {Object | null} [params.selectedVariant] A selected product variant
 */
const updateDrawerUI = ({ stores, userLocationData, selectedVariant }) => {
  if (stores.length === 0) {
    return;
  }
  updateStoreList(stores);
  updateUserLocationUI(userLocationData);
  if (selectedVariant) {
    updateProductInDrawer(selectedVariant);
  }
};

/**
 * Update product fulfillment (store pickup) page UI elements
 * @param {Object} params
 * @param {Array} params.stores - A collection of store data
 * @param {Object | null} [params.selectedVariant] A selected product variant
 */
const updatePageUI = ({ stores, selectedVariant }) => {
  if (stores.length === 0) {
    // No stores are within range, do not display fulfillment (pickup) options
    return;
  }
  updateClosestStore(stores);
  if (selectedVariant) {
    // If an available product variant has been selected, show store details
    showPickupStoreDetails();
  } else {
    // Otherwise, hide store details
    hidePickupStoreDetails();
  }
};

/**
 * Master function for updating product fulfillment options block in buybox
 * and the drawer content
 * @param {Object} params
 * @param {string} [params.id] - A variant ID
 * @param {string} [params.color] - A variant color
 * @param {string} [params.size] - A variant size
 */
export const updateUI = ({ id, color, size }) => {
  const { stores, userLocationData } = getState();
  const selectedVariant =
    color && size
      ? getAvailableSelectedVariant({ color, size })
      : id
      ? getAvailableSelectedVariant({ id })
      : null;
  updatePageUI({ stores, selectedVariant });
  updateDrawerUI({
    stores,
    userLocationData,
    selectedVariant
  });
};
