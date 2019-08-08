import pcConfig from '../../persistent-cart/config';
import scriptsConfig from '../../shared/config';
import fetch from 'unfetch';

const { STOREFRONT_API, NO_CACHE_HEADERS } = scriptsConfig;

/**
 * Generic function for issuing a GQL query or mutation
 * @param {*} query - A GQL query
 * @param {Object} data - Data to pass to the query
 * @param {string} [url] - A request URL, which, if passed, will override the default
 * @param {Object} [extraConfig = {}] - Additional configuration used to add to the existing request configuration
 * @returns {Promise<Object>} - Data returned from the GQL query or mutation
 */
export const makeRequest = (query, data, url, extraConfig = {}) =>
  fetch(url || pcConfig.API_URL, {
    body: query(data),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...extraConfig.headers
    }
  })
    .then(response => {
      if (!response.ok) {
        const message = response.statusText;
        throw new Error(
          `Failed GQL request. Status: ${response.status}${message &&
            `; message: ${message}`}`
        );
      }
      return response.json();
    })
    /**
     * GQL returns either only `data` or `errors`, which is an array of objects.
     * `errors` are the result of a malformed request (not HTTP errors)
     */
    .then(({ data, errors }) => {
      if (errors) {
        // Just reduce all error messages to a comma-delimited string (only one string if there's only one error)
        const messages = errors.reduce(
          (acc, err, idx) => `${acc}${idx > 0 ? ', ' : ''}${err.message}`,
          ''
        );
        // Log a new error with one or more messages about why this request failed, for debugging purposes
        console.info('PC: ', messages);
      }
      return data;
    });

/**
 * Make a request, passing along extra headers to enforce no caching of the response
 * @param {*} query - A GQL query
 * @param {Object} data - Data to pass to the query
 * @param {string} [url] - A request URL, which, if passed, will override the default
 * @param {Object} [extraConfig = {}] - Additional configuration used to add to the existing request configuration
 * @returns {Promise<Object>} - Data returned from the GQL query or mutation
 */
export const makeUncachedRequest = (query, data, url, extraConfig = {}) => {
  return makeRequest(query, data, url, {
    headers: {
      ...NO_CACHE_HEADERS,
      ...extraConfig.headers
    }
  });
};

/**
 * Make a GraphQL request to the Shopify Storefront API by passing an override URL and additional configuration
 * to the underlying `makeRequest` master GraphQL request function
 * @param {*} query - A tagged template literal that will be used to create a GraphQL request using passed-in data
 * @param {Object} data - The data to be passed to a GraphQL query
 * @returns {Promise<Object>} - Data returned from the GQL query or mutation
 */
export const makeShopifyStorefrontRequest = (query, data) => {
  const headers = {};
  headers[STOREFRONT_API.HEADER_NAME] = STOREFRONT_API.KEY;
  return makeUncachedRequest(query, data, STOREFRONT_API.URL, {
    headers
  });
};
