// @ts-check

import Cookies from 'js-cookie';
import {
  STOREFRONT_API_IS_TESTED,
  STOREFRONT_API_TEST_TIMEOUT_MINUTES
} from '../shared/constants';

// @TODO - test these storage tests!!

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#Feature-detecting_localStorage
 * @param {string} type - type of storage ('localStorage' or 'sessionStorage') to test
 * @returns {boolean} - whether the test succeeded
 */
const storageAvailableTest = type => {
  let storage;
  try {
    storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (error) {
    return (
      error instanceof DOMException &&
      // Everything except Firefox
      (error.code === 22 ||
        // Firefox
        error.code === 1014 ||
        // Test name field too, because code might not be present
        // Everything except Firefox
        error.name === 'QuotaExceededError' ||
        // Firefox
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // Acknowledge QuotaExceededError only if there's something already stored
      storage.length !== 0
    );
  }
};

/**
 * Helper testing for localStorage availability
 * If sessionStorage is needed, create another const using the string 'sessionStorage'
 */
export const localStorageAvailable = storageAvailableTest('localStorage');

/**
 * Helper testing for sessionStorage availability
 */
export const sessionStorageAvailable = storageAvailableTest('sessionStorage');

/**
 * Test the client's ability to set and get cookies (unset after testing)
 * @returns {boolean} - Whether the test passed
 */
const cookiesAvailableTest = () => {
  const test = 'persistent-cart-test';
  Cookies.set(test, 'foo');
  const storedVal = Cookies.get(test);
  Cookies.remove(test);
  const deletedVal = Cookies.get(test);
  return storedVal && !deletedVal;
};

/**
 * Export the boolean return value from cookiesAvailableTest
 */
export const cookiesAvailable = cookiesAvailableTest();

/**
 * Helper to set an object in localStorage
 * @param {string} name
 * @param {Object} value
 */
export const setObjectInLocalStorage = (name, value) =>
  localStorage.setItem(name, JSON.stringify(value));

/**
 * Helper to get an object from its stringified representation in localStorage
 * @param {string} name
 * @returns {Object} - Parsed object contained in localStorage as a string
 */
export const getObjectFromLocalStorage = name =>
  JSON.parse(localStorage.getItem(name));

/**
 * Helper to remove an item from localStorage
 * @param {string} item The item to remove from localStorage
 */
export const removeItemFromLocalStorage = item => localStorage.removeItem(item);

/**
 * Helper to set an object in sessionStorage
 * @param {string} name
 * @param {Object} value
 */
export const setObjectInSessionStorage = (name, value) =>
  sessionStorage.setItem(name, JSON.stringify(value));

/**
 * Helper to get an object from its stringified representation in sessionStorage
 * @param {string} name
 * @returns {Object} - Parsed object contained in sessionStorage as a string
 */
export const getObjectFromSessionStorage = name =>
  JSON.parse(sessionStorage.getItem(name));

/**
 * Helper to remove an item from sessionStorage
 * @param {string} item The item to remove from sessionStorage
 */
export const removeItemFromSessionStorage = item =>
  sessionStorage.removeItem(item);

/**
 * @typedef {Object} ValueObjectWithExpiration
 * @property {*} value
 * @property {number} expires
 */

/**
 * Helper to check whether a value (in a ValueObjectWithExpiration) is expired
 * @param {ValueObjectWithExpiration} valueObj
 * @returns {boolean} valueObj is not valid or is expired
 */
export const isValueObjectExpired = valueObj =>
  new Date().getTime() > valueObj.expires;

/**
 * Sets a flag that indicating whether a call to test the Storefront API has
 * succeeded or failed, with an expiration.
 * No-op if `sessionStorage` is not available.
 * @param {boolean} value
 */
export const setStorefrontAPITestedState = value => {
  if (sessionStorageAvailable) {
    // Expires in fifteen minutes
    const expires =
      new Date().getTime() + STOREFRONT_API_TEST_TIMEOUT_MINUTES * 60 * 1000;
    setObjectInSessionStorage(
      STOREFRONT_API_IS_TESTED,
      /** @type {ValueObjectWithExpiration} */ {
        value,
        expires
      }
    );
  }
};

/**
 * Gets a flag that indicates whether a call to test the Storefront API has
 * succeeded or failed.
 * Checks against a stored value, which includes an expiration, in milliseconds.
 * On expiration, nullifies the value - it must be set again to get a new
 * expiration.
 * @returns {boolean | null}
 */
export const getStorefrontAPITested = () => {
  /** @type {ValueObjectWithExpiration | null} */
  const valueObj = getObjectFromSessionStorage(STOREFRONT_API_IS_TESTED);
  if (valueObj === null || isValueObjectExpired(valueObj)) {
    removeItemFromSessionStorage(STOREFRONT_API_IS_TESTED);
    return null;
  }
  return valueObj.value;
};
