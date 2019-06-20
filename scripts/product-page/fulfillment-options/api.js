// @ts-check

/**
 * @typedef {Object} UserLocationData
 * @property {string} zipcode
 * @property {string} city
 * @property {string} stateCode
 */

import fetchStores from '../../store-finder/utilities/fetch-stores';
import {
  checkPermissionsAndFetchUserLocation,
  getLocationInfoFromReverseGeocodedCurrentPosition
} from '../../store-finder/utilities/fetch-user-location';
import formatStoreAddress from '../../store-finder/utilities/format-store-address';
import getDistance from '../../store-finder/utilities/get-distance';
import loadGoogleMaps from '../../store-finder/services/load-google-maps';

export { loadGoogleMaps };

/**
 * Fetches a list of stores, with accompanying data (address, hours, etc)
 *
 * @returns {Promise<Object[]>} A collection of Decathlon store objects
 */
export const fetchStoreList = async () => {
  const stores = await fetchStores();
  return stores.map(store => ({
    ...store,
    distance: '',
    distanceFloat: ''
  }));
};

/**
 * Fetches the user's approximate location based on their IP address or
 * geolocation, depending on permissions or flag passed in
 *
 * @param {Object} [options]
 * @param {boolean} [options.useGeolocation] - Whether to immediately use geolocation
 * @returns {Promise<UserLocationData>} User's location information
 */
export const fetchUserLocationData = async ({ useGeolocation } = {}) => {
  /**
   * Make use of the geolocation API, order of precedence:
   * 1) If geolocation hasn't already been allowed, use IP-based location
   * 2) If geolocation is already allowed, use it over IP-based location
   * (with no user intervention needed)
   * 3) (In another function, triggered by user action, allow the user to
   * override IP-based location with geolocation, if supported, or input Zip
   *
   * @see https://stackoverflow.com/questions/10077606/check-if-geolocation-was-allowed-and-get-lat-lon
   * @see get-user-geolocation.js scripts/store-finder/utilities/get-user-geolocation.js
   */
  const {
    zip_code: zipcode,
    city,
    region_code: stateCode
  } = await (useGeolocation
    ? getLocationInfoFromReverseGeocodedCurrentPosition()
    : checkPermissionsAndFetchUserLocation());
  return { zipcode, city, stateCode };
};

/**
 * Calculate the distance between a user's location and store locations
 *
 * @param {Object} data The user's location and Decathlon stores
 * @param {string} data.origin User's zipcode
 * @param {Array} data.stores A collection of store locations
 *
 * @returns {Promise<Array>} The distance calculation for each store
 */
export const getDistanceData = async ({ origin, stores }) => {
  const destinations = stores.map(store => formatStoreAddress(store));
  // Calculate distance from user's location to store locations
  const distances = await getDistance({
    origin,
    destinations
  });
  return distances;
};
