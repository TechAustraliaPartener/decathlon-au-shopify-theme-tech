/**
 * Objects and functions for managing state to control
 * product review loading, fetching, sorting, and filtering
 */

import { reviewsPerPage } from './template-data';
import { prerenderedReviewList } from './query-ui';

/**
 * This will be used for holding state to control load/sort/filter interactions
 */
export const originalReviewsState = {
  page: 1,
  reviewsPerPage,
  // The number of pre-rendered reviews will be set when the main script runs
  prerenderedReviews: 0,
  // The default sort, to be used on page load
  sort: 'createdAt',
  // The default sort direction, to be used on page load
  direction: 'desc',
  // The ratings filter, which is none on page load
  notes: ''
};

/**
 * Create an initial reviews state object as a clone of the default
 */
let _reviewsState = { ...originalReviewsState };

/**
 * Update the reviews state object with one or more new values
 * @param {Object} updateObj Whatever property of the reviews state object needs updating
 */
export const setReviewsState = updateObj => {
  // @TODO - Remove comments for production
  console.log('Updating state with the following value(s): ', updateObj);
  _reviewsState = { ..._reviewsState, ...updateObj };
};

/**
 * Getter for retrieving the latest reviewsState object
 */
export const getReviewsState = () => _reviewsState;

/**
 * Sets the number of prerendered reviews on the reviews state object
 */
export const setPrerenderedReviewsOnState = () => {
  setReviewsState({ prerenderedReviews: prerenderedReviewList.length });
};

/**
 * Checks whether the `sort`, `direction`, and `notes` values
 * have been set back to the original (default) state
 * The default state is
 * 1. 'sort':'createdAt'
 * 2. 'direction':'desc'
 * 3. 'notes': '' (means this param to filter by rating, if passed, is ignored; same as not being set)
 * When this evaluates to true, the page will behave as it did on first load,
 * incrementally showing pre-rendered reviews until it needs to call to the API for more.
 * @returns {boolean}
 */
export const getIsDefaultQuery = () => {
  const { sort, direction, notes } = getReviewsState();
  return (
    originalReviewsState.sort === sort &&
    originalReviewsState.direction === direction &&
    originalReviewsState.notes === notes
  );
};

/**
 * Set up a query for getting filtered reviews
 * Resets query pagination, sort, and direction, takes in a `notes` (aka, rating) value for the next query
 * @param {string|number} notes - A value to use to query for reviews with a particular rating
 */
export const setReviewsStateForFilter = notes => {
  const { sort, direction, page } = originalReviewsState;
  setReviewsState({ notes, sort, direction, page });
};

/**
 * Set up a query for getting sorted reviews
 * Resets query pagination and notes (aka, ratings filter)
 * and sets sort and direction variables for the next query
 * @param {Object} params
 * @param {string} params.sort - A sort type to set for the next query
 * @param {string} params.direction - A direction to set for the next query
 */
export const setReviewsStateForSort = ({ sort, direction }) => {
  const { page, notes } = originalReviewsState;
  setReviewsState({ page, notes, sort, direction });
};
