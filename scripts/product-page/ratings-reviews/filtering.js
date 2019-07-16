// @ts-check

import { REVIEW_FILTER, STAR_RATING } from './constants';
import { delegateEvent } from '../../utilities/event-delegator';
import { setReviewsStateForFilter } from './state';
import { loadNewReviews, resetSort } from './update-ui';

/**
 * Handler for clicks on rows in the Reviews Ratings Matrix
 * 1. Gets the rating from data on the element
 * 2. Sets state for the upcoming API query
 * 3. Resets any previous sort selection
 * 4. Clears out previously loaded reviews and hides the page-loaded reviews
 * 5. Makes a query to get new, filtered-by-rating reviews and update the UI
 * @TODO - Analyze for any accessiblity improvements
 */
const reviewFilterHandler = function() {
  /** @type {string} */
  const rating = this.dataset && this.dataset[STAR_RATING];
  if (!rating) {
    return;
  }
  setReviewsStateForFilter(rating);
  resetSort();
  loadNewReviews();
};

/**
 * Settings passed to event delegation module
 */
const filterEventDelegationSettings = {
  selector: `.${REVIEW_FILTER}`,
  type: 'click',
  callback: reviewFilterHandler,
  listenerName: 'reviewFilterListener'
};

export const reviewsFilteringInit = () => {
  delegateEvent(filterEventDelegationSettings);
};
