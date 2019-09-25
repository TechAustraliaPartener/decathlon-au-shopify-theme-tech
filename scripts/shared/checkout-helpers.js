// @ts-check

import {
  setObjectInSessionStorage,
  getObjectFromSessionStorage,
  removeItemFromSessionStorage
} from '../utilities/storage';
import { IS_CHECKING_OUT } from './constants';
import scriptsConfig, { DEBUG } from './config';

const {
  SELECTORS: {
    CART,
    CART_SUBMIT_BUTTON,
    CHECKOUT: {
      URLS: { CART_URL }
    }
  }
} = scriptsConfig;

/**
 * Sets a flag indicating that a checkout has been initiated
 */
export const setCheckingOutFlag = () =>
  setObjectInSessionStorage(IS_CHECKING_OUT, 'true');

/**
 * Unsets a flag indicating that a checkout has been initiated
 */
export const unsetCheckingOutFlag = () =>
  removeItemFromSessionStorage(IS_CHECKING_OUT);

/**
 * Asserts the user has landed on the cart page and the checking out flag
 * was not unset, indicating that this was a redirect back from checkout (which
 * always returns to the cart page)
 * @returns {Boolean}
 */
export const wasFailedCheckout = () =>
  getObjectFromSessionStorage(IS_CHECKING_OUT) === 'true' &&
  window.location.pathname === CART_URL;

/**
 * Get the cart form element by its JS-selector
 * @type {HTMLButtonElement | null} The cart form
 */
export const cartFormSubmitEl = document.querySelector(CART_SUBMIT_BUTTON);

/**
 * Pass a callback to be called on checkout (the form submit event)
 * @param {Function} callback
 * @returns {Function} Function to call to remove the delegated event listener
 */
export const onCheckout = callback => {
  const submitListener = function(e) {
    /**
     * Verify that the event came from a cart form.
     * This is necessary because the listener is attached to the document,
     * and the form may not exist on page load.
     */
    if (!e.target.closest(CART)) {
      return;
    }
    if (DEBUG)
      console.debug(`👟 Checkout event captured on element matching
    '${CART}'`);
    // Execute the callback, bound to the form and passing the event
    callback.call(e.target, e);
  };
  /**
   * Attaching a listener to document so we can receive events for forms that
   * didn't exist on page load
   */
  document.addEventListener('submit', submitListener);
  // Return a function that can remove the event listener
  return () => document.removeEventListener('submit', submitListener);
};
