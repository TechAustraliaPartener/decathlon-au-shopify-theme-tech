import fetchStores from '../../store-finder/utilities/fetch-stores';
import fetchUserLocation from '../../store-finder/utilities/fetch-user-location';
import formatStoreAddress from '../../store-finder/utilities/format-store-address';
import getDistance from '../../store-finder/utilities/get-distance';
import loadGoogleMaps from '../../store-finder/services/load-google-maps';

export { loadGoogleMaps };

/**
 * Fetches a list of stores, with accompanying data (address, hours, etc)
 *
 * @returns {Array} A collection of Decathlon stores
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
 * Fetches the user's approximate location based on their IP address
 *
 * @returns {String} User's zipcode
 */
export const fetchUserLocationData = async () => {
  /**
   * @TODO Make use of the geolocation API, order of precedence:
   * 1) If geolocation hasn't already been allowed, use IP-based location
   * 2) If geolocation is already allowed, use it over IP-based location (with no user intervention needed)
   * 3) In the drawer, allow the user to override IP-based location with geolocation,
   * if supported
   *
   * @see https://stackoverflow.com/questions/10077606/check-if-geolocation-was-allowed-and-get-lat-lon
   * @see get-user-geolocation.js scripts/store-finder/utilities/get-user-geolocation.js
   */
  const userLocation = await fetchUserLocation();
  const { zip_code: zipcode } = userLocation;
  return zipcode;
};

/**
 * Calculate the distance between a user's location and store locations
 *
 * @param {Object} data The user's location and Decathlon stores
 * @param {String} data.origin User's zipcode
 * @param {Array} data.stores A collection of store locations
 *
 * @returns {Array} The distance calculation for each store
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
