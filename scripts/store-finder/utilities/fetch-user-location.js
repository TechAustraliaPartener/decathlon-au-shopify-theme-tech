// @ts-check

import getReverseGeocode from './get-reverse-geocode';

/**
 * @typedef {Object} LocationInfo
 * @property {string} zip_code - A user's Zip Code
 * @property {string} city - A user's city name
 * @property {string} region_code - A user's state abbr, usually
 */

/**
 * @typedef {Object} PositionObject
 * @property {Object} coords
 * @property {number} coords.latitude
 * @property {number} coords.longitude
 */

/**
 * Get a user's location via IP, using ipstack
 * @see https://apilayer.com
 * @returns {Promise<LocationInfo>}
 *
 * @TODO - This function was originally included for Store Finder and was
 * repurposed for use with Product Fulfillment Options, via the function
 * `fetchUserLocationData`.
 * @see //scripts/product-page/fulfillment-options/api.js
 *
 * The shape of typedef `LocationInfo` (`fetchUserLocation`) and
 * typedef `UserLocationData` (`fetchUserLocationData`) is nearly identical.
 * Here, it is what is returned by ipstack. Elsewhere, we return the same
 * shape from reverse geocoding, to match.
 *
 * If we can modify `fetchUserLocation` to return the same shape as we consume
 * in the ui (camelCased properties, renamed as needed), and use throughout the
 * code, we can potentially reduce the number of functions needed and clean
 * things up.
 *
 * It was decided to not do this during review of PRs related to
 * Product Fulfillment, since it could result in time lost and regressions in
 * Store Finder, but should be considered a possible technical debt task.
 *
 * @see https://github.com/decathlon-usa/shopify-theme-decathlonusa/pull/516
 */
const fetchUserLocation = async () => {
  try {
    const url =
      'https://api.ipstack.com/check?access_key=23cb2745b5ee35580d6f00373f14f868&legacy=1';
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Error getting user location by IP: ', error.message);
    throw error;
  }
};

/**
 * Get a user's current position using navigator.geolocation.
 * Can be used with `await` call in an `async` function to return `coords`.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
 * @returns {Promise<PositionObject>}
 */
const getCurrentPosition = () =>
  new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });

/**
 * Get a user's location details from geolocation
 * @see https://developers.google.com/maps/documentation/javascript/geocoding#ReverseGeocoding
 * @returns {Promise<Object>} Reverse geocoded location object
 */
const getReverseGeocodedFromCurrentPosition = async () => {
  const {
    coords: { latitude, longitude }
  } = await getCurrentPosition();
  const latLng = {
    lat: latitude,
    lng: longitude
  };
  const reverseGeocoded = await getReverseGeocode(latLng);
  return reverseGeocoded;
};

/**
 * Get a user's Location details from reverse-geocode object
 * The return object is modified to match City-, State-, and
 * Zip-Code-related output from ipstack
 * @param {Object} reverseGeocoded - The return object from a revers-geocode
 * request to Google Maps
 * @see https://developers.google.com/maps/documentation/javascript/geocoding#ReverseGeocoding
 * @returns {LocationInfo}
 */
export const getReverseGeocodedLocationInfo = reverseGeocoded => {
  return reverseGeocoded.address_components.reduce((
    /** @type {Object} */ acc,
    /** @type {Object} */ curr
  ) => {
    if (curr.types.includes('postal_code')) {
      return { ...acc, zip_code: curr.long_name };
    }
    if (curr.types.includes('locality')) {
      return { ...acc, city: curr.long_name };
    }
    if (curr.types.includes('administrative_area_level_1')) {
      return { ...acc, region_code: curr.short_name };
    }
    return acc;
  }, {});
};

/**
 * Get a user's location info from reverse-geolocated output of user's
 * current position
 * @see https://developers.google.com/maps/documentation/javascript/geocoding#ReverseGeocoding
 * @returns {Promise<LocationInfo>}
 */
export const getLocationInfoFromReverseGeocodedCurrentPosition = async () => {
  try {
    const reverseGeocoded = await getReverseGeocodedFromCurrentPosition();
    return getReverseGeocodedLocationInfo(reverseGeocoded);
  } catch (error) {
    console.error(
      'Error getting location info via reverse-geocoded geolocation: ',
      error.message
    );
    throw error;
  }
};

/**
 * Get a user's Location Info via geolocation, if already allowed, or using IP,
 * if geolocation permissions not granted (or if the navigator permissions
 * API is not available)
 * @returns {Promise<LocationInfo>}
 */
export const checkPermissionsAndFetchUserLocation = async () => {
  try {
    if (navigator.permissions) {
      const permission = await navigator.permissions.query({
        name: 'geolocation'
      });
      if (permission.state === 'granted') {
        return await getLocationInfoFromReverseGeocodedCurrentPosition();
      }
    }
    return await fetchUserLocation();
  } catch (error) {
    console.error(
      'Error getting user location via geolocation: ',
      error.message
    );
    throw error;
  }
};

/**
 * Export IP-based location fetching function as module default.
 * This is legacy from the Store Finder implementation, and used in Store Finder
 * as a default export.
 * Other export(s) are named.
 */
export default fetchUserLocation;
