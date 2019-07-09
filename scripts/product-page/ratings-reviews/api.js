/**
 * Functions related to fetching product ratings and reviews data from the OpenVoice API
 */

import { stringify } from 'query-string';
import fetch from 'unfetch';
import { REVIEWS_BASE_URL, REVIEWS_BASE_QUERY_PARAMS } from './constants';
import { modelCode } from './template-data';

/**
 * Get product review data for a product by model code
 * @param {Object} params
 * @param {string} params.modelCode A "model code" provided from DEC reviews metafields
 * @param {Object} [params.queryParams] Extra query parameters to be added to the request (optional)
 * @returns {Promise<Object>} The review data
 * @throws Will throw if the model code cannot be obtained from the template
 */
const getProductReviewsData = ({ modelCode, queryParams }) => {
  if (typeof modelCode !== 'string' || modelCode === '') {
    throw new Error('Cannot fetch product data, missing model code');
  }
  const params = {
    offer: modelCode,
    ...REVIEWS_BASE_QUERY_PARAMS,
    ...queryParams
  };
  return fetch(`${REVIEWS_BASE_URL}?${stringify(params)}`).then(res =>
    res.json()
  );
};

/**
 * Wrapper for requesting product review data
 * @param {Object} queryParams Additional parameters needed for a particular request (e.g. sort, direction)
 * @returns {Promise<Object>} Data from the request for reviews
 */
export const getReviews = queryParams => {
  /**
   * Check for necessary model code value before calling the API
   */
  if (modelCode) {
    return getProductReviewsData({ modelCode, queryParams })
      .then(data => data)
      .catch(error => console.error(error));
  }
  return Promise.reject(
    new Error('Missing a Model Code. Cannot get new review data.')
  );
};
