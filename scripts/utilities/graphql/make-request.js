import pcConfig from '../../persistent-cart/config';
import scriptsConfig from '../../shared/config';
import fetch from 'unfetch';

const {
  STOREFRONT_API: { HEADER_NAME, KEY }
} = scriptsConfig;

/**
 * Generic function for issuing a GQL query or mutation
 * @param {*} query - A GQL query
 * @param {Object} data - Data to pass to the query
 * @param {string} [url] - A request URL, which, if passed, will override the default
 * @param {Object} [extraGqlConfig = {}] - Additional configuration used to add to the existing request configuration
 * @returns {Promise<Object>} - Data returned from the GQL query or mutation
 */
export const makeRequest = (query, data, url, extraGqlConfig = {}) =>
  fetch(url || pcConfig.API_URL, {
    body: query(data),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...extraGqlConfig.headers
    }
  })
    .then(response => response.json())
    // GQL returns either only `data` or `data` (probably null) and `errors`, which is an array of objects
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
 * Make a GraphQL request to the Shopify Storefront API by passing an override URL and additional configuration
 * to the underlying `makeRequest` master GraphQL request function
 * @param {*} query - A tagged template literal that will be used to create a GraphQL request using passed-in data
 * @param {Object} data - The data to be passed to a GraphQL query
 * @param {*} url - A request URL to pass to the underlying `makeRequest` function
 * @returns {Promise<Object>} - Data returned from the GQL query or mutation
 */
export const makeShopifyStorefrontRequest = (query, data, url) => {
  const headers = {};
  headers[HEADER_NAME] = KEY;
  return makeRequest(query, data, url, {
    headers
  });
};
