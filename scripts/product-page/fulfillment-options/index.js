import {
  loadGoogleMaps,
  fetchUserLocationData,
  fetchStoreList,
  getDistanceData
} from './api';
import { initUpdateUI } from './update-ui';
import { getUIElements } from './init-ui';
import { getDistanceSortedStores } from './utilities';
import { OUT_OF_AREA_THRESHOLD } from './constants';

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
  // Get all needed DOM elements for this module
  const pickupOptionsEls = getUIElements();
  // Abort if any needed elements are not available
  if (!pickupOptionsEls) {
    throw new Error('Did not get all required DOM elements');
  }
  // Get stores and user's location to proceed with display logic
  const [stores, zipcode] = await Promise.all([
    /**
     * Retrieve the store list
     * @see stores.js ./scripts/store-finder/data/stores.js
     */
    fetchStoreList(),
    // Determine the user's location
    fetchUserLocationData(),
    /**
     * The loading of the Google Maps API is required for related APIs
     * to work (e.g. getDistanceData's google.maps.DistanceMatrixService)
     */
    loadGoogleMaps()
  ]);
  // Calculate the distance from the user to the store(s)
  const distances = await getDistanceData({ origin: zipcode, stores });
  // Adds the distance values to each store's object data
  const storeList = getDistanceSortedStores({
    stores,
    distances,
    threshold: OUT_OF_AREA_THRESHOLD
  });
  /**
   * Initialize the UI Updating module. Returns the `updateUI` function, to
   * be called from the product-page module's main with product variant
   * selection values
   *
   * @TODO - Consider updating this file, `update-ui`, and the main product-page
   * `index` to invert the async initialization responsibilities:
   * The goal would be to do all async initialization in this module *after* the
   * product-page init passes in color/size/id data on page load.
   * This module would still need to expose an updateUI function for controlling
   * fulfillment options updates on product selection.
   */
  const updateUI = initUpdateUI({
    stores: storeList,
    zipcode,
    pickupOptionsEls
  });
  // Return the updateUI method to be used when product selection changes
  return updateUI;
};
