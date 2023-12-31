// @ts-check

import { loadGoogleMaps, fetchUserLocationData } from './api';
import { updateUI } from './update-ui';
import { getUIElements } from './init-ui';
import { bindEventHandlers } from './events';
import { getAvailablePickupStores } from './services';
import { updateState } from './state';

/**
 * Initialize the Fulfillment Options / Store Pickup (with drawer) module
 * Use store distance and user location data to set up the page on load
 * @TODO -
 * 1) Get selected product variant into drawer content
 * 2) Use geolocation if available
 * 3) Allow user to choose location or allow geolocation within drawer
 * 4) Format drawer content
 */
export const init = async () => {
  try {
    // Get all needed DOM elements for this module
    const pickupOptionsEls = getUIElements();
    // Abort if any needed elements are not available
    if (!pickupOptionsEls) {
      throw new Error('Did not get all required DOM elements');
    }
    /**
     * The loading of the Google Maps API is required for related APIs
     * to work (e.g. getDistanceData's google.maps.DistanceMatrixService)
     */
    await loadGoogleMaps();
    // Retrieve user location based on either IP address or geolocation (pending previous permission)
    const userLocationData = await fetchUserLocationData();
    // Retrieve ordered list of stores available within an acceptable distance
    const storeList = await getAvailablePickupStores(userLocationData.zipcode);
    // Bind needed event handlers
    bindEventHandlers();
    // Set stores and userLocationData in our state module
    updateState({
      stores: storeList,
      userLocationData
    });
    /**
     * @TODO - Consider updating this file, `update-ui`, and the main product-page
     * `index` to invert the async initialization responsibilities:
     * The goal would be to do all async initialization in this module *after* the
     * product-page init passes in color/size/id data on page load.
     * This module would still need to expose an updateUI function for controlling
     * fulfillment options updates on product selection.
     */
    // Return the updateUI method to be used when product selection changes
    return updateUI;
  } catch (error) {
    console.error('Error thrown in fulfillment options init:', error);
    throw error;
  }
};
