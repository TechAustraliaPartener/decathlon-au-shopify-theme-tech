/**
 * Handle different options for sorting product reviews
 */

import { reviewsSortSelect } from './query-ui';
import { setReviewsStateForSort, getIsDefaultQuery } from './state';
import {
  resetDefaultReviewsDisplay,
  getMoreReviews,
  resetReviews
} from './update-ui';

/**
 * Takes sorting parameters from data attributes on the sort select's options
 * and determines whether to reset the default reviews display (most recent first)
 * or to get more reviews with the appropriate `sort` and `direction` parameters
 * @param {Object} event
 */
const reviewsSortHandler = event => {
  const options = event.target.options;
  const selectedIndex = event.target.selectedIndex;
  if (!options || isNaN(selectedIndex)) {
    return;
  }
  const selectedOption = options[selectedIndex];
  /**
   * Set the correct sort parameters on the state object
   * Also set the page back to the default, initial state
   */
  setReviewsStateForSort({
    sort: selectedOption && selectedOption.dataset.sortType,
    direction: selectedOption && selectedOption.dataset.sortDirection
  });
  /**
   * If the default sort is selected (compared with the page-load default state),
   * call to reset the default display, using pre-loaded reviews. Otherwise,
   * reset the UI and call to get new reviews using a different sort query.
   */
  if (getIsDefaultQuery()) {
    resetDefaultReviewsDisplay();
  } else {
    resetReviews();
    getMoreReviews();
  }
};

/**
 * Initialize the change listener for the reviews sorting select element
 */
export const reviewsSortInit = () => {
  reviewsSortSelect &&
    reviewsSortSelect.addEventListener('change', reviewsSortHandler);
};
