// @ts-check

import {
  REVIEW_FILTER,
  STAR_RATING,
  REVIEW_CLEAR_FILTER,
  REVIEW_SUMMARY_CLEAR_FILTER
} from './constants';
import { delegateEvent } from '../../utilities/event-delegator';
import { setReviewsStateForFilter, clearFilter } from './state';

/**
 * Handler for clicks on rows in the Reviews Ratings Matrix
 * 1. Gets the rating from data on the element
 * 2. Sets state for the upcoming API query
 * 3. Resets any previous sort selection
 * 4. Clears out previously loaded reviews and hides the page-loaded reviews
 * 5. Makes a query to get new, filtered-by-rating reviews and update the UI
 * @TODO - Analyze for any accessibility improvements
 * @this HTMLDivElement
 */
const reviewFilterHandler = function() {
  const rating = this.dataset && this.dataset[STAR_RATING];
  if (!rating) {
    return;
  }
  setReviewsStateForFilter(rating);
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
  const clearReviewFilterButtons = document.querySelectorAll(
    `.${REVIEW_CLEAR_FILTER},.${REVIEW_SUMMARY_CLEAR_FILTER}`
  );
  clearReviewFilterButtons.forEach(btn =>
    btn.addEventListener('click', clearFilter)
  );
};
