// @ts-check

import { decode, encode } from 'qss';
import Cookies from 'js-cookie';

/**
 * Append a query string key and value to a URL, if it isn't already there
 * @param {string} url
 * @param {string} key
 * @param {string | boolean | number} value
 * @returns {string} The updated URL
 */
export const appendQueryStringToURL = (url, key, value) => {
  const hasQS = url.indexOf('?') > -1;
  const hasQSKey = url.indexOf(key) > -1;
  if (hasQSKey) {
    return;
  }
  return `${url}${hasQS ? '&' : '?'}${key}=${value}`;
};

/**
 * Update a query string in a URL using `history.replaceState`
 * Preserves any `hash` value
 * If `value` is ommitted, removes that key from the query string
 * @param {string} key
 * @param {string | boolean | number} [value]
 */
export const updateQueryString = (key, value) => {
  const qs = window.location.search.substr(1);
  const hash = window.location.hash.substr(1);
  const parsedQueryParams = decode(qs);
  if (value) {
    parsedQueryParams[key] = value;
  } else {
    delete parsedQueryParams[key];
  }
  const newQueryParams = encode(parsedQueryParams);
  window.history.replaceState(
    null,
    null,
    `${newQueryParams ? `?${newQueryParams}` : ''}${
      hash ? `#${hash}` : `${newQueryParams ? '' : '#'}`
    }`
  );
};

/**
 * Checks whether a cookie value has been set
 * If it has, uses the `updateQueryString` utility to set a key/value pair
 * on the URL's query string
 * Finally, deletes the cookie value
 */
export const convertCookieValToQueryString = key => {
  // Check whether a specific key / value has been set in a cookie
  const cookieValue = Cookies.get(key);
  if (typeof cookieValue !== 'undefined') {
    updateQueryString(key, cookieValue);
    // Clean up cookies
    Cookies.remove(key);
  }
};
