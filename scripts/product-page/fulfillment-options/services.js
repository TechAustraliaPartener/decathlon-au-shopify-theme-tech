// @ts-check

import { fetchStoreList, getDistanceData } from './api';
import { getDistanceSortedStores } from './utilities';
import { OUT_OF_AREA_THRESHOLD } from './constants';

/**
 * Fetch stores and calculate the distance between origin and store locations.
 * Sort stores ordering, filtering stores outside of acceptable threshold.
 *
 * @param {string} origin The user's location via IP address, geolocation, or input
 * Examples of associated origins:
 * IP address ("97209")
 * geolocation ("Palo Alto, California 98202")
 * user input ("97302", "San Fran", "Emeryville, Cali, 98201")
 *
 * @returns {Promise<Array>} The arranged list of stores available in respect of distance and threshold
 */
export const getAvailablePickupStores = async origin => {
  try {
    let storeList = [];
    // Get store objects
    const stores = await fetchStoreList();
    // Calculate the distance from the user's origin to the store(s)
    const distances = await getDistanceData({ origin, stores });
    // Adds the distance values to each store's object data
    if (distances.length > 0) {
      storeList = getDistanceSortedStores({
        stores,
        distances,
        threshold: OUT_OF_AREA_THRESHOLD
      });
    }
    // Return the list of stores
    return storeList;
  } catch (error) {
    console.error(
      'Error thrown in fulfillment store fetch and distance calculation:',
      error
    );
    throw error;
  }
};
