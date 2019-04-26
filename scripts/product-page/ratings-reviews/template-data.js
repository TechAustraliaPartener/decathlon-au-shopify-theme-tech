import { REVIEWS_CONTAINER_CLASS } from './constants';

/**
 * The model code and, total pre-rendered reviews value, and reviews-per-page value
 * are retrieved from a data attribute in the UI.
 * Model code is necessary for calling the Reviews API
 */
const jsReviewsEl = document.querySelector(`.${REVIEWS_CONTAINER_CLASS}`) || {
  dataset: {}
};

const totalPrerenderedReviews = jsReviewsEl.dataset.totalPrerenderedReviews;

export const modelCode = jsReviewsEl.dataset.modelCode;
export const reviewsPerPage = jsReviewsEl.dataset.reviewsPerPage;

/**
 * Confirm that the total number of pre-rendered reviews is (a number greater than 0 and) evenly divisible by
 * the reviews-per-page number (also a number, greater than 0)
 * If this value is false, it will stop attempts to do paginated API requests (see below)
 */
export const validReviewNumbers =
  !isNaN(parseInt(totalPrerenderedReviews, 10)) &&
  !isNaN(parseInt(reviewsPerPage, 10)) &&
  totalPrerenderedReviews > 0 &&
  reviewsPerPage > 0 &&
  totalPrerenderedReviews % reviewsPerPage === 0;
