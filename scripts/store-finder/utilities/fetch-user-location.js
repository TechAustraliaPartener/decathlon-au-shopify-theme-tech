// @ts-check

import getReverseGeocode from './get-reverse-geocode';

/**
 * @typedef {Object} ZipLocation
 * @property {string} zip_code - A user's Zip Code
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
 * @returns {Promise<ZipLocation>}
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
 * Get a user's Zip Code from reverse-geocode object
 * The return object is modified to match Zip-Code-related output from ipstack
 * @param {Object} reverseGeocoded - The return object from a revers-geocode
 * request to Google Maps
 * @see https://developers.google.com/maps/documentation/javascript/geocoding#ReverseGeocoding
 * @returns {ZipLocation}
 */
const getGeoLocationZipCode = reverseGeocoded => {
  const postalCodeObj = reverseGeocoded.address_components.find(component =>
    component.types.includes('postal_code')
  );
  return { zip_code: postalCodeObj.long_name };
};

/**
 * Get a user's Zip Code from reverse-geolocated output of user's current position
 * @see https://developers.google.com/maps/documentation/javascript/geocoding#ReverseGeocoding
 * @returns {Promise<ZipLocation>}
 */
const getZipFromReverseGeocodedCurrentPosition = async () => {
  try {
    const reverseGeocoded = await getReverseGeocodedFromCurrentPosition();
    return getGeoLocationZipCode(reverseGeocoded);
  } catch (error) {
    console.error(
      'Error getting Zip Code via reverse-geocoded geolocation: ',
      error.message
    );
    throw error;
  }
};

/**
 * Get a user's Zip Code via geolocation, if already allowed, or using IP,
 * if geolocation permissions not granted (or if the navigator permissions
 * API is not available)
 * @returns {Promise<ZipLocation>}
 */
export const checkPermissionsAndFetchUserLocation = async () => {
  try {
    if (navigator.permissions) {
      const permission = await navigator.permissions.query({
        name: 'geolocation'
      });
      if (permission.state === 'granted') {
        return await getZipFromReverseGeocodedCurrentPosition();
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
