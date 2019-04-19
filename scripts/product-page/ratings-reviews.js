/**
 * Ratings & Reviews
 * Uses a Reviews API to fetch ratings and reviews data,
 * renders or re-renders via Handlebars templates onto the page.
 */
import { stringify } from 'query-string';
import fetch from 'unfetch';
import {
  REVIEWS_BASE_URL,
  REVIEWS_BASE_QUERY_PARAMS,
  REVIEW_VOTE_CLASS,
  MORE_REVIEWS_CLASS,
  JS_PREFIX
} from './constants';
import Handlebars from 'handlebars';

const jsReviewsEl = document.querySelector(`.${JS_PREFIX}Reviews`);
/**
 * The model code is retrieved from a data attribute in the UI. Necessary for calling the Reviews API
 */
const modelCode =
  jsReviewsEl && jsReviewsEl.dataset && jsReviewsEl.dataset.modelCode;

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
    throw new Error('Cannot fetch product data, misssing model code');
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
const getReviews = queryParams => {
  /**
   * Checks for Handlebars and necessary page elements, then continues if conditions are met
   */
  if (Handlebars && modelCode) {
    return getProductReviewsData({ modelCode, queryParams })
      .then(data => data)
      .catch(error => console.error(error));
  }
  return Promise.reject(new Error(`Missing Handlebars or a Model Code`));
};

/**
 * @TODO implement
 * Placeholder for handling vote links
 * @param {Object} event
 */
const voteLinkHandler = event => {
  event.preventDefault();
};

/**
 * @TODO implement
 * Placeholder for implementing `get more reviews` behavior
 * @param {Object} event
 */
const moreReviewsRequestHandler = event => {
  event.preventDefault();
  /**
   * @TODO - filter the request by page or ID of last review displayed already -
   * may need to be reverse-engineered a bit
   */
  getReviews()
    .then(data => console.log(data))
    .catch(error => console.error(error));
};

/**
 * Entry point for review and answer up/down-voting
 */
const voteInit = () => {
  const voteLinks = document.querySelectorAll(`.${REVIEW_VOTE_CLASS}`);
  [...voteLinks].forEach(link =>
    link.addEventListener('click', voteLinkHandler)
  );
};

/**
 * Entry point for initializing 'Get more reviews' functionality
 */
const moreReviewsInit = () => {
  const moreReviewsEl = document.querySelector(`.${MORE_REVIEWS_CLASS}`);
  moreReviewsEl &&
    moreReviewsEl.addEventListener('click', moreReviewsRequestHandler);
};

/**
 * Put all functions that need to run on product-page load here
 */
const init = () => {
  voteInit();
  moreReviewsInit();
};

export default init;
