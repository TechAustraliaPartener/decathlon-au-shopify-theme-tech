import {
  loadGoogleMaps,
  fetchUserLocationData,
  fetchStoreList,
  getDistanceData
} from './api';
import { updateDrawerUI, updatePageUI } from './update-ui';
import { getUIElements } from './init-ui';
import { getDistanceSortedStores } from './utilities';
import { OUT_OF_AREA_THRESHOLD } from './constants';

/**
 * Initialize the Fulfillment Options / Store Pickup (with drawer) module
 * Use store distance and user location data to set up the page on load
 * @TODO -
 * 1) Add logic to deal with product variant selection
 * 2) Add listeners for product variant selection changes (to update UI)
 * 3) Get selected product variant into drawer content
 * 4) Use geolocation if available
 * 5) Allow user to choose location or allow geolocation within drawer
 * 6) Format drawer content
 */
export const init = async () => {
  try {
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
    // Update DOM or alter markup and inject into the DOM
    updateDrawerUI({
      stores: storeList,
      zipcode,
      pickupOptionsEls
    });
    updatePageUI({
      stores: storeList,
      pickupOptionsEls
    });
  } catch (error) {
    console.error(error);
  }
};
