/**
 * Ratings & Reviews
 * Works with server-rendered reviews on page load.
 * Uses a Reviews API to fetch ratings and reviews data,
 * renders or re-renders via Handlebars templates onto the page.
 */
import {
  MORE_REVIEWS_CONTAINER_CLASS,
  REVIEW_CLASS,
  REVIEW_PRELOADED_CLASS,
  IS_HIDDEN_CLASS
} from './constants';
import {
  handlebarsInit,
  handlebarsCheck,
  templateNewReviews
} from './templating';
import { reviewsPerPage, validReviewNumbers } from './template-data';
import { getReviews } from './api';
import { voteInit } from './voting';

/**
 * Register Handlebars partials and helpers
 */
handlebarsInit();

/**
 * STATE MANAGEMENT
 */

/**
 * This will be used for holding state to control load/sort/filter interactions
 */
const originalReviewsState = {
  page: 1,
  reviewsPerPage,
  prerenderedReviews: 0,
  sorted: false,
  filtered: false,
  sort: null,
  filter: null
};

/**
 * Create an initial reviews state object as a clone of the default
 */
let reviewsState = { ...originalReviewsState };

/**
 * Update the reviews state object with one or more new values
 * @param {Object} updateObj Whatever property of the reviews state object needs updating
 */
const setReviewsState = updateObj => {
  // @TODO - Remove comments for production
  console.log('Updating state with the following value(s): ', updateObj);
  reviewsState = { ...reviewsState, ...updateObj };
};

/**
 * REVIEWS
 */

/**
 * Unhide a set number of prerendered reviews
 * The number is the same as the number that will used to fetch pages of reviews from the API,
 * after all prerendered reviews are shown
 * @param {Object[]} [reviews=[]] Array of reviews data objects
 */
const showMoreReviews = reviews =>
  reviews
    .filter(review => review.classList.contains(IS_HIDDEN_CLASS))
    .forEach((review, index) => {
      if (index < reviewsPerPage) {
        review.classList.remove(IS_HIDDEN_CLASS);
      }
    });

/**
 * Fetches reviews from the API and renders the data to the page using a Handlebars templating function
 */
const getMoreReviews = () => {
  /**
   * Get the list of all reviews currently rendered (dynamically loaded and server-rendered)
   */
  const renderedReviewList = document.querySelectorAll(`.${REVIEW_CLASS}`);
  /**
   * Get the number of prerendered reviews currently registered on the state object
   */
  const { prerenderedReviews } = reviewsState;
  /**
   * If there are server-rendered reviews on the page, and not yet any
   * dynamically loaded reviews, set the reviewsState object, page value for the upcoming API call.
   * This number will be the total number of pre-rendered reviews divided
   * by the default paginated value (used in every API call), plus one (the next page)
   */
  if (
    prerenderedReviews > 0 &&
    renderedReviewList.length === prerenderedReviews
  ) {
    setReviewsState({ page: prerenderedReviews / reviewsPerPage + 1 });
  }
  /**
   * Get more reviews from the API to display, setting the page value for the call
   * Set the query parameter (nb) for number of reviews to request from the API to the value from the template
   */
  getReviews({ page: reviewsState.page, nb: reviewsPerPage })
    .then(data => {
      if (!data || !Array.isArray(data.items)) {
        throw new Error('Review data not succesfully retrieved from the API');
      }
      return templateNewReviews(data.items);
    })
    // After successfully updating the template, increment reviewsState.page for the subsequent request
    .then(setReviewsState({ page: reviewsState.page + 1 }))
    .catch(error => console.error(error));
};

/**
 * Handle getting more reviews
 *
 * On page load, this begins by displaying more (hidden) server-rendered reviews,
 * then transitions to loading more from the API.
 * On sorted and filtered lists, will need to immediately go to the API.
 * @todo Implement revisions based on sort and filter state
 * @param {Object} event
 */
const moreReviewsRequestHandler = event => {
  event.preventDefault();
  /**
   * Get the list of server-rendered reviews.
   * This will exist on page load, but will be wiped out and
   * replaced with dynamically loaded reviews on sort or filter
   */
  const prerenderedReviewList = document.querySelectorAll(
    `.${REVIEW_PRELOADED_CLASS}`
  );
  const prerenderedReviewListLength = prerenderedReviewList.length;
  // Convert to Array for running Array helpers on the NodeList
  const prerenderedReviewListArray = [...prerenderedReviewList];
  // Set the length of the prerenderedReviewList on the state object
  if (prerenderedReviewListLength !== reviewsState.prerenderedReviews) {
    setReviewsState({ prerenderedReviews: prerenderedReviewList.length });
  }
  // Get the number of visible, server-rendered reviews
  const visiblePrerenderedReviews = prerenderedReviewListArray.filter(
    review => !review.classList.contains(IS_HIDDEN_CLASS)
  ).length;
  /**
   * If there are server-rendered reviews on the page
   * and the total number exceeds what's visible, just show more
   * (Note: 0 is not GT 0 - if that's the case, there are no server-rendered reviews)
   */
  if (reviewsState.prerenderedReviews > visiblePrerenderedReviews) {
    showMoreReviews(prerenderedReviewListArray);
  } else {
    /**
     * See `validReviewNumbers`. If the total number of pre-rendered reviews (> 0) is not evenly divisible by
     * the default number of reviews per page to load, do not try to make paginated requests for more
     * reviews, and output an error to the console
     */
    if (!validReviewNumbers) {
      console.error(
        'Total number of pre-rendered reviews and reviews-per-page are not in sync. Cannot dynamically calculate paginated requests for more reviews.'
      );
      return;
    }
    /**
     * Need to load and dynamically display reviews after calling the API
     */
    handlebarsCheck(getMoreReviews)();
  }
};

/**
 * Entry point for initializing 'Get more reviews' functionality
 */
const moreReviewsInit = () => {
  const moreReviewsEl = document.querySelector(
    `.${MORE_REVIEWS_CONTAINER_CLASS}`
  );
  moreReviewsEl &&
    moreReviewsEl.addEventListener('click', moreReviewsRequestHandler);
};

/**
 * Put all functions that need to run on product-page load here
 */
export const reviewsInit = () => {
  voteInit();
  moreReviewsInit();
};
