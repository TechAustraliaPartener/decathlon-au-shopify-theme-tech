/**
 * PREFIXES
 */

/**
 * All styling CSS classes should have the CSS_PREFIX
 */
export const CSS_PREFIX = 'de-';
/**
 * All JS-bound CSS classes should have the JS_PREFIX
 */
export const JS_PREFIX = `js-${CSS_PREFIX}`;

/**
 * CSS Classes
 */

/**
 * The CSS class used to update the UI to an "active" state
 */
export const IS_ACTIVE_CLASS = `${CSS_PREFIX}is-active`;

/**
 * The CSS class used on links to upvote or downvote a review or answer
 */
export const REVIEW_VOTE_CLASS = `${JS_PREFIX}CustomerReviewVote`;

/**
 * Reusable values
 */

/**
 * Multiplier for converting stars to a percentage
 */
export const STAR_RATING_PERCENTAGE_MULTIPLIER = 20;

/**
 * Returns a base URL for querying the Decathlon Reviews API
 * @param {string} modelCode
 * @returns {string} URL with modelCode
 */
export const GET_REVIEWS_BASE_URL = (modelCode = '') =>
  `https://reviews.decathlon.com/api/en_US/review/list?site=1132&type=1&locales=en&nb=3&offer=${modelCode}`;
