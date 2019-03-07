import Cookies from 'js-cookie';

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
 * Test the client's ability to set and get cookies (unset after testing)
 * @param {string} test - A string to test setting and getting on a the document.cookie
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
