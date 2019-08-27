// @ts-check

import { DEBUG } from '../shared/config';
import { decode } from 'qss';
import { IS_ONLINE_STORE_CHECKOUT } from '../shared/constants';
import config from './config';
import { convertCookieValToQueryString } from '../utilities/query-string';
const {
  CLASSES: { SHIPPING_OPTIONS_CONTAINER }
} = config;

/**
 * Determine whether the current URL has a query param indicating this is an
 * online-store-created checkout
 * @returns {boolean}
 */
export const getIsOnlineStoreCheckout = () => {
  // Convert any value set in a cookie to a value in the URL's query string
  convertCookieValToQueryString(IS_ONLINE_STORE_CHECKOUT);
  // Remove "?" from the query string (substr(1))
  const qs = window.location.search.substr(1);
  const parsedQueryParams = decode(qs);
  const isOnlineStoreCheckout = Boolean(
    parsedQueryParams[IS_ONLINE_STORE_CHECKOUT]
  );
  if (DEBUG) {
    console.debug(`isOnlineStoreCheckout: ${isOnlineStoreCheckout}`);
  }
  return isOnlineStoreCheckout;
};

/**
 * Helper to create a mutation observer, preconfigured to watch for mutations
 * on Shipping Options
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserverInit
 * @param {Object} params
 * @param {MutationObserverInit} [params.observerOptions]
 * @param {Function} params.callback - Function to call from within the mutation
 * callback. NOTE: If the callback mutates the DOM, make sure it does not result
 * in an endless loop of mutations. It should short-circuit once it has handled
 * the initial mutation on which it's supposed to run.
 * @param {HTMLElement | Node | null} params.targetNode
 * - The element/node to observe mutations on.
 * - If it evaluates to `null`, the function will terminate
 * - Defaults to a shipping options container element
 *   (This element is output by the liquid drop, and there is no direct access
 *   to it. @see https://help.shopify.com/en/themes/development/layouts/checkout/best-practices)
 */
export const createMutationObserver = ({
  observerOptions = { childList: true, subtree: true },
  callback,
  targetNode
}) => {
  if (!targetNode || typeof callback !== 'function') {
    return;
  }
  const observer = new MutationObserver(mutationList => {
    mutationList.forEach(mutation => {
      if (DEBUG) console.debug('🐡 DOM Mutation!', mutation);
      callback();
    });
  });
  observer.observe(targetNode, observerOptions);
};

/**
 * Creates a MutationObserver specifically targeting the element that wraps
 * shipping options
 * @param {Function} callback - The function to run on an observed mutation
 */
export const createShippingOptionsMutationObserver = callback =>
  createMutationObserver({
    targetNode: /** @type {HTMLElement} */ (document.querySelector(
      `.${SHIPPING_OPTIONS_CONTAINER}`
    )),
    callback
  });
