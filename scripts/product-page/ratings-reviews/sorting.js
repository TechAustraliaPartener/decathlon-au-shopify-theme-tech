// @ts-check

/**
 * Handle different options for sorting product reviews
 */

import { reviewsSortSelect } from './query-ui';
import { setReviewsStateForSort } from './state';

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
};

/**
 * Initialize the change listener for the reviews sorting select element
 */
export const reviewsSortInit = () => {
  reviewsSortSelect &&
    reviewsSortSelect.addEventListener('change', reviewsSortHandler);
};
