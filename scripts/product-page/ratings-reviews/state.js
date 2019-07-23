// @ts-check

/**
 * @typedef {Object} ReviewsState
 * @property {number} page - The page to set for for a reviews API query
 * @property {number | undefined} reviewsPerPage - How many reviews should be
 * shown or requested in each API call
 * @property {number} prerenderedReviews - How many reviews will be server-side
 * rendered (maximum)
 * @property {string} sort - A sort type to set for for a reviews API query
 * @property {string} direction  - The direction to set for for a reviews API query
 * @property {string} notes - A rating to set for a reviews API query
 * @property {boolean} loading - Whether the UI should be in a loading state
 * (during an API request)
 * @property {boolean} isMoreReviewRequest - Is a request for additional reviews
 * (rather than a new sort or filter request)
 */

/**
 * Objects and functions for managing state to control
 * product review loading, fetching, sorting, and filtering
 */

import { reviewsPerPage } from './template-data';
import { prerenderedReviewList } from './query-ui';
import { createState } from '../create-state';

export const originalReviewsSortFilterState = {
  // The default sort, to be used on page load
  sort: 'createdAt',
  page: 1,
  // The default sort direction, to be used on page load
  direction: 'desc',
  // The ratings filter, which is none on page load
  notes: ''
};

/**
 * This will be used for holding state to control load/sort/filter interactions
 * @type {ReviewsState}
 */
const originalReviewsState = {
  ...originalReviewsSortFilterState,
  reviewsPerPage,
  // The number of pre-rendered reviews will be set when the main script runs
  prerenderedReviews: 0,
  loading: false,
  isMoreReviewRequest: false
};

export const {
  updateState: setReviewsState,
  getState: getReviewsState,
  onChange: onReviewsStateChange
} = createState(originalReviewsState);

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
 * @param {string} notes - A value to use to query for reviews with a particular rating
 */
export const setReviewsStateForFilter = notes => {
  setReviewsState({ ...originalReviewsSortFilterState, notes });
};

export const clearFilter = () => {
  // Reset both filter and sort, per client request
  setReviewsState(originalReviewsSortFilterState);
};

/**
 * Set up a query for getting sorted reviews
 * Resets query pagination and notes (aka, ratings filter)
 * and sets sort and direction variables for the next query
 * @param {Object} params
 * @param {string | undefined} params.sort - Sort to use for next API query
 * @param {string | undefined} params.direction - Direction to use for next
 * API query
 */
export const setReviewsStateForSort = ({ sort, direction }) => {
  setReviewsState({ ...originalReviewsSortFilterState, sort, direction });
};
