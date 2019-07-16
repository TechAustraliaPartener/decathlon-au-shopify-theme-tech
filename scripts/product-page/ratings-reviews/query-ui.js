/**
 * Queries to get different sets of reviews
 */

import {
  REVIEW_CLASS,
  REVIEW_PRELOADED_CLASS,
  REVIEW_SORT_SELECT
} from './constants';

/**
 * Get the NodeList of server-rendered reviews (this will remain static,
 * so no need for a function)
 */
export const prerenderedReviewList = document.querySelectorAll(
  `.${REVIEW_PRELOADED_CLASS}`
);

/**
 * Get all reviews, loaded from the API or pre-rendered
 * @returns {Object} A NodeList of all reviews
 */
export const getAllReviews = () =>
  document.querySelectorAll(`.${REVIEW_CLASS}`);

/**
 * Get all reviews that have been loaded from the API (i.e., were not pre-rendered on page load)
 * @returns {Object} a NodeList of all non-preloaded reviews
 */
export const getLoadedReviews = () =>
  document.querySelectorAll(`.${REVIEW_CLASS}:not(.${REVIEW_PRELOADED_CLASS})`);

/**
 * Get the sort select
 */
/** @type HTMLSelectElement */
export const reviewsSortSelect = document.querySelector(
  `.${REVIEW_SORT_SELECT}`
);
