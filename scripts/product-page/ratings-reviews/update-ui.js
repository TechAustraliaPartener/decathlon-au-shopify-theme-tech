// @ts-check

/**
 * A collection of functions for loading, showing,
 * and hiding/resetting reviews
 */

import {
  MORE_REVIEWS_BUTTON_CLASS,
  MORE_REVIEWS_BUTTON_LOADING_TEXT_CLASS,
  MORE_REVIEWS_BUTTON_TEXT_CLASS,
  REVIEWS_LOADING_CLASS,
  REVIEWS_LOADING_TIMEOUT,
  IS_TRANSITIONING_CLASS,
  REVIEW_CLASS,
  IS_HIDDEN_CLASS,
  REVIEW_FILTER,
  STAR_RATING,
  REVIEW_FILTER_STATUS,
  REVIEW_FILTER_STAR_VALUE
} from './constants';
import {
  prerenderedReviewList,
  getAllReviews,
  getLoadedReviews,
  reviewsSortSelect
} from './query-ui';
import { handlebarsCheck, templateNewReviews } from './templating';
import { reviewsPerPage, validReviewNumbers } from './template-data';
import {
  getReviewsState,
  setReviewsState,
  getIsDefaultQuery,
  onReviewsStateChange,
  originalReviewsSortFilterState
} from './state';
import { fetchReviews } from './api';
import { showElement, hideElement } from '../../utilities/element-utils';
import { IS_ACTIVE_CLASS } from '../constants';
import { DEBUG } from '../../shared/config';

let moreReviewsEl;
let defaultButtonTextEl;
let loadingButtonTextEl;
let loadingReviewsEl;
/** @type {HTMLElement[]} */
let reviewFilterEls;
/** @type {HTMLElement} */
let reviewFilterStatusEl;
/** @type {HTMLElement} */
let reviewFilterStarValueEl;
let loadingTimeout = null;
let wasLoading = false;

/**
 * Hides all reviews that aren't currently hidden
 * @TODO - A11y analysis here
 */
const hideAllReviews = () =>
  getAllReviews().forEach(review => review.classList.add(IS_HIDDEN_CLASS));

/**
 * Unhide a set number of reviews (based on the `reviewsPerPage` value obtained
 * from the template)
 * @param {Object} params
 * @param {Object[]} [params.reviews=[]] Array of review elements
 * @param {boolean} [params.reset] Whether to reset to hiding all reviews before
 * showing the initial set
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
 * Fully remove all reviews that were dynamically loaded (i.e., not pre-loaded
 * with the page)
 */
const clearLoadedReviews = () => {
  getLoadedReviews().forEach(review => review.parentNode.removeChild(review));
};

/**
 * Removes all dynamically loaded reviews and then hides
 * all reviews
 * To be used before fetching new reviews from the API, with
 * updated query parameters (e.g., on changing sort type)
 */
const resetReviews = () => {
  clearLoadedReviews();
  hideAllReviews();
};

/**
 * Cancel a trigger to set loading state
 */
const cancelLoadingState = () => {
  if (loadingTimeout) clearTimeout(loadingTimeout);
  loadingTimeout = null;
};

/**
 * Set loading state after a timeout
 */
const setLoadingState = () => {
  cancelLoadingState();
  loadingTimeout = setTimeout(
    () => setReviewsState({ loading: true }),
    REVIEWS_LOADING_TIMEOUT
  );
};

/**
 * Fetches reviews from the API and renders the data to the page using a
 * Handlebars templating function
 * @param {boolean} [isMoreReviewRequest] - Is a request for additional reviews
 * (rather than a new sort or filter request)
 */
export const loadNewReviews = isMoreReviewRequest => {
  /**
   * Trigger a loading state, with timeout
   */
  setLoadingState();
  /**
   * Set state to reflect whether this is a request for additional reviews, or
   * a sort or filter
   */
  setReviewsState({
    isMoreReviewRequest: Boolean(isMoreReviewRequest)
  });
  /**
   * Get the list of all reviews currently rendered (dynamically loaded and
   * server-rendered)
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
   * dynamically loaded reviews, set the `reviewsState` object, page value for
   * the upcoming API call.
   * This number will be the total number of pre-rendered reviews divided
   * by the default paginated value (used in every API call), plus one
   * (the next page)
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
   * Set the query parameter (nb) for number of reviews to request from the API
   * to the value from the template
   */
  fetchReviews({ page, sort, direction, notes, nb: reviewsPerPage })
    .then(data => {
      if (!data || !Array.isArray(data.items)) {
        throw new Error('Review data not successfully retrieved from the API');
      }
      if (!isMoreReviewRequest) {
        resetReviews();
      }

      try {
        const { reviews_excluded_countries, reviews_min_rating } = window.vars.themeSettings;

        data.items = data.items.filter(i => reviews_excluded_countries.indexOf(i.country) === -1);
      } catch (err) {
        console.error(err);
      }

      return templateNewReviews(data.items);
    })
    /**
     * After successfully updating the template, increment `reviewsState.page`
     * for the subsequent request
     */
    /**
     * Unset loading state, no matter what happens
     * `Promise.finally` may not be available, so unset in both `then` and `catch`
     */
    .then(() => {
      cancelLoadingState();
      setReviewsState({ page: getReviewsState().page + 1, loading: false });
    })
    .catch(error => {
      console.error(error);
      cancelLoadingState();
      setReviewsState({ loading: false });
    });
};

/**
 * Handle getting more reviews
 *
 * On page load, this begins by displaying more (hidden) server-rendered reviews,
 * then transitions to loading more from the API.
 * On sorted and filtered lists, will need to immediately go to the API.
 * @param {Event} event
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
     * See `validReviewNumbers`. If the total number of pre-rendered reviews
     * (> 0) is not evenly divisible by the default number of reviews per page
     * to load, do not try to make paginated requests for more reviews, and
     * output an error to the console
     */
    if (!validReviewNumbers) {
      console.error(
        `Total number of pre-rendered reviews and reviews-per-page are not in
        sync. Cannot dynamically calculate paginated requests for more reviews.`
      );
      return;
    }
    /**
     * Need to load and dynamically display reviews after calling the API
     * Passed to the `handlebarsCheck` helper to ensure errors aren't thrown.
     * In this case, inform `loadNewReviews` that this is a request for
     * more reviews, not a sort or filter event.
     */
    handlebarsCheck(loadNewReviews)(true);
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
 * Entry point for initializing 'Get more reviews' functionality
 */
export const moreReviewsInit = () => {
  moreReviewsEl = document.querySelector(`.${MORE_REVIEWS_BUTTON_CLASS}`);
  defaultButtonTextEl = document.querySelector(
    `.${MORE_REVIEWS_BUTTON_TEXT_CLASS}`
  );
  loadingButtonTextEl = document.querySelector(
    `.${MORE_REVIEWS_BUTTON_LOADING_TEXT_CLASS}`
  );
  loadingReviewsEl = document.querySelector(`.${REVIEWS_LOADING_CLASS}`);
  moreReviewsEl &&
    moreReviewsEl.addEventListener('click', moreReviewsRequestHandler);
  // @ts-ignore
  reviewFilterEls = [...document.querySelectorAll(`button.${REVIEW_FILTER}`)];
  reviewFilterStatusEl = document.querySelector(`.${REVIEW_FILTER_STATUS}`);
  reviewFilterStarValueEl = document.querySelector(
    `.${REVIEW_FILTER_STAR_VALUE}`
  );
};

/**
 * Visually marks reviews that will be replaced by a new set of reviews after
 * data is returned from an API request
 */
const addUnloadingStyleToReviews = () => {
  document
    .querySelectorAll(`.${REVIEW_CLASS}`)
    .forEach(review => review.classList.add(IS_TRANSITIONING_CLASS));
};

/**
 * Visually unmarks reviews after data is returned from an API request
 */
const removeUnloadingStyleFromReviews = () => {
  document
    .querySelectorAll(`.${REVIEW_CLASS}`)
    .forEach(review => review.classList.remove(IS_TRANSITIONING_CLASS));
};

/**
 * Show various loading state updates in the UI, depending on the type of API
 * request being made.
 * @param {boolean} isMoreReviewRequest - Is a request for additional reviews
 * (rather than a new sort or filter request)
 */
const showLoadingState = isMoreReviewRequest => {
  DEBUG && console.log(`👀 showLoadingState called.`);
  wasLoading = true;
  moreReviewsEl && moreReviewsEl.setAttribute('disabled', '');
  showElement(loadingButtonTextEl);
  hideElement(defaultButtonTextEl);
  if (!isMoreReviewRequest) {
    showElement(loadingReviewsEl);
    addUnloadingStyleToReviews();
  }
};

/**
 * Remove loading state updates from the UI
 */
const removeLoadingState = () => {
  DEBUG && console.log(`🚀 removeLoadingState called.`);
  wasLoading = false;
  moreReviewsEl && moreReviewsEl.removeAttribute('disabled');
  hideElement(loadingButtonTextEl);
  showElement(defaultButtonTextEl);
  hideElement(loadingReviewsEl);
  removeUnloadingStyleFromReviews();
};

/**
 * Render function for updating the UI during loading of new reviews
 * Triggers loading state only after a pre-defined, short timeout
 * @param {import('./state').ReviewsState} reviewsState
 */
const renderLoading = ({ loading, isMoreReviewRequest }) => {
  if (loading) {
    return showLoadingState(isMoreReviewRequest);
  }
  if (wasLoading) {
    removeLoadingState();
  }
};

/**
 * The UI-loading render function is passed to the state change function returned
 * from `create-state.js`
 */
onReviewsStateChange(renderLoading);

/**
 * @param {import('./state').ReviewsState} state
 */
const renderSortFilterUI = ({ notes, sort, direction }) => {
  // Switch the sort dropdown back to the original value if the state matches the original sort
  if (
    reviewsSortSelect &&
    sort === originalReviewsSortFilterState.sort &&
    direction === originalReviewsSortFilterState.direction
  ) {
    reviewsSortSelect.selectedIndex = 0;
  }

  reviewFilterEls.forEach(el => {
    if (el.dataset[STAR_RATING] === notes) {
      el.classList.add(IS_ACTIVE_CLASS);
    } else {
      el.classList.remove(IS_ACTIVE_CLASS);
    }
  });
  if (notes) {
    reviewFilterStarValueEl.textContent = ` ${notes} star`;
    showElement(reviewFilterStatusEl);
  } else {
    hideElement(reviewFilterStatusEl);
  }
};

onReviewsStateChange(renderSortFilterUI);

onReviewsStateChange(
  () => {
    /**
     * If the default sort is selected (compared with the page-load default state),
     * call to reset the default display, using pre-loaded reviews. Otherwise,
     * reset the UI and call to get new reviews using a different sort query.
     */
    if (getIsDefaultQuery()) {
      resetDefaultReviewsDisplay();
    } else {
      loadNewReviews();
    }
  },
  state => [state.sort, state.direction, state.notes]
);
