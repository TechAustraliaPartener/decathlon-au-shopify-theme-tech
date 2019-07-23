// @ts-check

/**
 * Functions related to fetching product ratings and reviews data from the OpenVoice API
 */

import { encode } from 'qss';
import fetch from 'unfetch';
import { REVIEWS_BASE_URL, REVIEWS_BASE_QUERY_PARAMS } from './constants';
import { modelCode } from './template-data';
import { DEBUG } from '../../shared/config';

/**
 * Get product review data for a product by model code
 * @param {Object} params
 * @param {string} params.modelCode A "model code" provided from DEC reviews
 * metafields
 * @param {Object} [params.queryParams] Extra query parameters to be added to
 * the request (optional)
 * @returns {Promise<Object>} The review data
 * @throws Will throw if the model code cannot be obtained from the template
 */
const fetchProductReviewsData = ({ modelCode, queryParams }) => {
  const params = {
    offer: modelCode,
    ...REVIEWS_BASE_QUERY_PARAMS,
    ...queryParams
  };
  return fetch(`${REVIEWS_BASE_URL}?${encode(params)}`).then(res => res.json());
};

/**
 * Wrapper for requesting product review data
 * @param {Object} queryParams Additional parameters needed for a particular
 * request (e.g. sort, direction)
 * @returns {Promise<Object>} Data from the request for reviews
 */
export const fetchReviews = queryParams => {
  DEBUG && console.log('Fetching reviews from API');
  /**
   * Check for necessary model code value before calling the API - also cannot
   * be an empty string
   */
  if (typeof modelCode === 'string' && modelCode) {
    return fetchProductReviewsData({ modelCode, queryParams });
  }
  return Promise.reject(
    new Error('Missing a Model Code. Cannot get new review data.')
  );
};
