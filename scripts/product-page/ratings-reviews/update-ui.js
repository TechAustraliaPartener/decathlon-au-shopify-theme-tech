/**
 * A collection of functions for loading, showing,
 * and hiding/resetting reviews
 */

import { MORE_REVIEWS_CONTAINER_CLASS, IS_HIDDEN_CLASS } from './constants';
import {
  prerenderedReviewList,
  getAllReviews,
  getLoadedReviews,
  reviewsSortSelect
} from './query-ui';
import { handlebarsCheck, templateNewReviews } from './templating';
import { reviewsPerPage, validReviewNumbers } from './template-data';
import { getReviewsState, setReviewsState, getIsDefaultQuery } from './state';
import { getReviews } from './api';

/**
 * Hides all reviews that aren't currently hidden
 * @TODO - A11y analysis here
 */
const hideAllReviews = () =>
  [...getAllReviews()].forEach(review => review.classList.add(IS_HIDDEN_CLASS));

/**
 * Unhide a set number of reviews (based on the `reviewsPerPage` value obtained from the template)
 * @param {Object} params
 * @param {Object[]} [params.reviews=[]] Array of review elements
 * @param {boolean} params.reset Whether to reset to hiding all reviews before showing the initial set
 */
const showMoreReviews = (
  { reviews, reset } = { reviews: [], reset: false }
) => {
  let reviewsToUpdate;
  if (reset) {
    hideAllReviews();
    reviewsToUpdate = reviews;
  } else {
    reviewsToUpdate = reviews
      /**
       * Filter out only reviews that are hidden, of the set that was passed in
       */
      .filter(review => review.classList.contains(IS_HIDDEN_CLASS));
  }
  /**
   * Unhide only reviews up to the reviewsPerPage value (minus 1, zero-indexed)
   */
  reviewsToUpdate.some((review, index) => {
    review.classList.remove(IS_HIDDEN_CLASS);
    return index === reviewsPerPage - 1;
  });
};

/**
 * Fully remove all reviews that were dynamically loaded (i.e., not pre-loaded with the page)
 */
const clearLoadedReviews = () => {
  [...getLoadedReviews()].forEach(review =>
    review.parentNode.removeChild(review)
  );
};

/**
 * Fetches reviews from the API and renders the data to the page using a Handlebars templating function
 */
export const getMoreReviews = () => {
  /**
   * Get the list of all reviews currently rendered (dynamically loaded and server-rendered)
   */
  const renderedReviewList = getAllReviews();
  /**
   * Get values currently registered on the state object
   * `prerenderedReviews`, `sort`, `direction`, and `notes`
   * won't be redefined before making a request
   * `page` may be redefined, so assign as a `let`
   */
  const currentState = getReviewsState();
  const { prerenderedReviews, sort, direction, notes } = currentState;
  let { page } = currentState;
  /**
   * If there are server-rendered reviews on the page, and not yet any
   * dynamically loaded reviews, set the reviewsState object, page value for the upcoming API call.
   * This number will be the total number of pre-rendered reviews divided
   * by the default paginated value (used in every API call), plus one (the next page)
   */
  if (
    getIsDefaultQuery() &&
    prerenderedReviews > 0 &&
    renderedReviewList.length === prerenderedReviews
  ) {
    /**
     * Set page to a new value,
     * then update the state's `page` value
     */
    page = prerenderedReviews / reviewsPerPage + 1;
    setReviewsState({ page });
  }
  /**
   * Get more reviews from the API to display, setting the page value for the call
   * Set the query parameter (nb) for number of reviews to request from the API to the value from the template
   */
  getReviews({ page, sort, direction, notes, nb: reviewsPerPage })
    .then(data => {
      if (!data || !Array.isArray(data.items)) {
        throw new Error('Review data not succesfully retrieved from the API');
      }
      return templateNewReviews(data.items);
    })
    // After successfully updating the template, increment reviewsState.page for the subsequent request
    .then(setReviewsState({ page: getReviewsState().page + 1 }))
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
  // Convert the prerenderedReviewList to an Array for running Array helpers on the NodeList
  const prerenderedReviewListArray = [...prerenderedReviewList];
  // Get the number of visible, server-rendered reviews
  const visiblePrerenderedReviews = prerenderedReviewListArray.filter(
    review => !review.classList.contains(IS_HIDDEN_CLASS)
  ).length;
  /**
   * If sort/filter are set to defalt and there are server-rendered reviews on the page
   * and the total number exceeds what's visible, just show more
   * (Note: 0 is not GT 0 - if that's the case, there are no server-rendered reviews)
   */
  if (
    getReviewsState().prerenderedReviews > visiblePrerenderedReviews &&
    getIsDefaultQuery()
  ) {
    showMoreReviews({ reviews: prerenderedReviewListArray });
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
     * Passed to the handlebarsCheck helper to ensure errors aren't thrown
     */
    handlebarsCheck(getMoreReviews)();
  }
};

/**
 * Removes all dynamically loaded reviews
 * and then starts to show pre-loaded (pre-rendered) reviews,
 * as is the default on page load
 */
export const resetDefaultReviewsDisplay = () => {
  clearLoadedReviews();
  showMoreReviews({ reviews: [...prerenderedReviewList], reset: true });
};

/**
 * Removes all dynamically loaded reviews and then hides
 * all reviews
 * To be used before fetching new reviews from the API, with
 * updated query parameters (e.g., on changing sort type)
 */
export const resetReviews = () => {
  clearLoadedReviews();
  hideAllReviews();
};

/**
 * Entry point for initializing 'Get more reviews' functionality
 */
export const moreReviewsInit = () => {
  const moreReviewsEl = document.querySelector(
    `.${MORE_REVIEWS_CONTAINER_CLASS}`
  );
  moreReviewsEl &&
    moreReviewsEl.addEventListener('click', moreReviewsRequestHandler);
};

/**
 * Resets the review sorting select element to its first option
 */
export const resetSort = () => {
  if (reviewsSortSelect) {
    reviewsSortSelect.selectedIndex = 0;
  }
};
