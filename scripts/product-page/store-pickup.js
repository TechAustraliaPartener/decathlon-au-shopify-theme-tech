import fetchStores from '../store-finder/utilities/fetch-stores';
import fetchUserLocation from '../store-finder/utilities/fetch-user-location';
import getDistance from '../store-finder/utilities/get-distance';
import loadGoogleMaps from '../store-finder/services/load-google-maps';
import formatStoreAddress from '../store-finder/utilities/format-store-address';
import { JS_PREFIX } from './constants';

/**
 * Root element(s)
 */
const STORE_PICKUP_SELECTOR = `${JS_PREFIX}StorePickup`;
const STORE_PICKUP_LIST_SELECTOR = `${STORE_PICKUP_SELECTOR}-list`;
const STORE_PICKUP_ZIPCODE_SELECTOR = `${STORE_PICKUP_SELECTOR}-zipcode`;
const storeTileList = document.getElementById(STORE_PICKUP_LIST_SELECTOR);
const userLocationZipcode = document.getElementById(
  STORE_PICKUP_ZIPCODE_SELECTOR
);

/**
 * Acceptable radius gate of user's location to store locations (in miles)
 * NOTE: For testing purposes only, adjust the 100 (in miles) integer to an acceptable in range value
 */
const OUT_OF_AREA_THRESHOLD = 100;
/**
 * Fetches a list of stores, with accompanying data (address, hours, etc)
 *
 * @returns {Array} A collection of Decathlon stores
 */
const fetchStoreList = async () => {
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
const fetchUserLocationData = async () => {
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
const getDistanceData = async ({ origin, stores }) => {
  const destinations = stores.map(store => formatStoreAddress(store));
  // Calculate distance from user's location to store locations
  const distances = await getDistance({
    origin,
    destinations
  });
  return distances;
};

/**
 * Add distance related fields to store objects, sort and filter
 *
 * @param {Object} data The Decathlon stores and corresponding distances
 * @param {Array} data.stores A collection of store locations
 * @param {Array} data.distance A collection of distance calculation
 * @returns {Array} A collection of stores
 */
const formatStores = ({ stores, distances }) =>
  stores
    // Add required additional fields
    .map((store, i) => ({
      ...store,
      distance: distances[i],
      distanceFloat: parseFloat(distances[i].replace(/,/g, ''), 10)
    }))
    // Determine if the store is within an acceptable distance
    .filter(store => store.distanceFloat <= OUT_OF_AREA_THRESHOLD)
    // Rearrange the stores from nearest to farthest
    .sort((a, b) => a.distanceFloat - b.distanceFloat);

/**
 * Build the HTML elements with data values populated
 *
 * @param {Array} stores A collection of stores
 * @returns {String} A collection of store tile components
 */
const buildStoreTile = stores =>
  stores
    .map(
      store => `
  <li class='de-StoreTile de-u-pad03 de-u-padEnds de-u-cursorPointer'>
    <div class='de-Grid de-u-textSizeBase'>
      <div class='de-StoreTile-info de-u-size4of6 de-u-padRight06'>
        <h3 class='de-StoreTile-name de-u-textGrow de-u-spaceNone de-u-textBold'>${
          store.city
        }</h3>
        <div class='de-StoreTile-address de-u-flex'>
          <p class='de-u-spaceNone de-u-textShrink1 de-u-textDarkGray'>${
            store.street1
          }</p>
        </div>
        <p class='de-u-spaceNone de-u-textDarkGray de-u-textShrink2 de-u-textMedium'>${
          store.street2
        }</p>
      </div>
      <div class='de-StoreTile-actions de-u-size2of6 de-u-textShrink2 de-u-flex'>
        <p class='de-u-spaceLeft06 de-u-textShrink1 de-u-textBlue de-u-textMedium'>${
          store.distance
        }</p>
      </div>
    </div>
  </li>
`
    )
    .join('');

/**
 * Update the related UI elements
 *
 * @param {Object} data The Decathlon stores and user's location
 * @param {Array} data.stores A collection of store data
 * @param {String} data.zipcode User's zipcode
 */
const updateUI = ({ stores, zipcode }) => {
  if (stores.length === 0) {
    // @TODO No stores are within range, remove pickup "options", prevent pickup drawer altogether
    return;
  }
  if (stores.length > 0) {
    storeTileList.innerHTML = buildStoreTile(stores);
  }
  if (zipcode) {
    userLocationZipcode.innerText = zipcode;
  }
};

/**
 * Put all functions that need to run on product-page load here
 */
export const init = async () => {
  try {
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
    const storeList = formatStores({ stores, distances });
    // Alter the markup and inject into the DOM
    updateUI({ stores: storeList, zipcode });
  } catch (error) {
    console.error(error);
  }
};
