import {
  getObjectFromLocalStorage,
  setObjectInLocalStorage,
  removeItemFromLocalStorage
} from '../utilities/storage';
import config from './config';

const {
  STORAGE: { LOGGED_IN, SHOPIFY_CART }
} = config;

/**
 * Get a saved Shopify cart from localStorage
 * @returns {Object} cart - The JSON.parsed cart object from localStorage
 */
export const getStoredShopifyCart = () =>
  getObjectFromLocalStorage(SHOPIFY_CART);

/**
 * Sets a Shopify cart object in localStorage
 * @param {Object} cart - The cart object to be stored
 */
export const setStoredShopifyCart = value =>
  setObjectInLocalStorage(SHOPIFY_CART, value);

/**
 * Removes a Shopify cart object in localStorage
 * @param {Object} cart - The cart object to be stored
 */
export const removeStoredShopifyCart = () =>
  removeItemFromLocalStorage(SHOPIFY_CART);

/**
 * Sets a key in localStorage flagging that the customer was logged in as of this times
 */
export const setWasLoggedIn = () => setObjectInLocalStorage(LOGGED_IN, true);

/**
 * Gets a boolean in localStorage flagging the state of customer login
 * Returns false if the key is not set
 * @returns {boolean} isLoggedIn
 */
export const getWasLoggedIn = () =>
  Boolean(getObjectFromLocalStorage(LOGGED_IN));

/**
 * Removes a boolean in localStorage flagging the state of customer login
 */
export const removeWasLoggedIn = () => removeItemFromLocalStorage(LOGGED_IN);

/**
 * A plain object for saving off some values used in our main chain of async functions,
 * across functions
 */
export const cache = {
  customerID: null,
  customer: null,
  // Will store the cart returned by Shopify after setting the `cart` cookie stored in the DB
  masterShopifyCart: null,
  customerCartExpired: false,
  currentCartCount: 0,
  setNewCustomerOrCart: false
};
