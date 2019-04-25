/**
 * PREFIXES
 */

/**
 * All styling CSS classes should have the CSS_PREFIX
 */
export const CSS_PREFIX = 'de-';

/**
 * All utillity classes should have the CSS_UTILITY_PREFIX
 */
export const CSS_UTILITY_PREFIX = `${CSS_PREFIX}u-`;

/**
 * All JS-bound CSS classes should have the JS_PREFIX
 */
export const JS_PREFIX = `js-${CSS_PREFIX}`;

/**
 * Icon prefix
 */
export const ICON_PREFIX = `${CSS_PREFIX}Icon-`;

/**
 * SUFFIXES
 */

/**
 * Container (e.g., for Handlebars)
 */
export const CONTAINER_SUFFIX = '-container';

/**
 * Template (e.g., for Handlebars)
 */
export const TEMPLATE_SUFFIX = '-template';

/**
 * TAGS
 */

/**
 * The product tag that indicates that the product will not be restocked
 */
export const IS_SOLD_OUT_TAG = 'EndOfLife';

/**
 * CSS Classes
 */

/**
 * The CSS classes used to update the UI to an "active" or "unavailable" state
 */
export const IS_ACTIVE_CLASS = `${CSS_PREFIX}is-active`;
export const IS_OUT_OF_STOCK_CLASS = `${CSS_PREFIX}is-outofstock`;
export const IS_SOLD_OUT_CLASS = `${CSS_PREFIX}is-soldout`;
/**
 * The CSS utility class for visibly hiding elements
 */
export const IS_HIDDEN_CLASS = `${CSS_UTILITY_PREFIX}hidden`;

/* ----- */

/**
 * Reviews-specific
 */

export const CUSTOMER_REVIEW = 'CustomerReview';

/**
 * The CSS class used on links to upvote or downvote a review or answer
 */
export const REVIEW_VOTE_CLASS = `${JS_PREFIX}${CUSTOMER_REVIEW}-vote`;

/**
 * The CSS class on the button used to get more reviews
 */
export const MORE_REVIEWS_CONTAINER_CLASS = `${JS_PREFIX}moreReviews`;

/**
 * The CSS class on a review block
 */
export const REVIEW_CLASS = `${JS_PREFIX}${CUSTOMER_REVIEW}`;

/**
 * The CSS class on the reviews container block
 */
export const REVIEWS_CONTAINER_CLASS = `${JS_PREFIX}${CUSTOMER_REVIEW}s`;

/**
 * The CSS class on a preloaded review block
 */
export const REVIEW_PRELOADED_CLASS = `${JS_PREFIX}${CUSTOMER_REVIEW}-preloaded`;

/**
 * The CSS ID on a reviews container block
 */
export const REVIEWS_CONTAINER_SELECTOR = `${CSS_PREFIX}${CUSTOMER_REVIEW}s`;

/* ----- */

/**
 * Reusable values
 */

/**
 * Multiplier for converting stars (1-5) to a percentage
 */
export const STAR_RATING_PERCENTAGE_MULTIPLIER = 20;

/**
 * Base URL for querying the Decathlon Reviews API
 */
export const REVIEWS_BASE_URL =
  'https://reviews.decathlon.com/api/en_US/review/list';

/**
 * Base query parameters for the Decathlon Reviews API
 * @TODO - determine what to do with the locale, which differs from what's set in the metafieilds script (is 'en', only)
 * Not sure what controls the content of reviews available on page load (question asked of DEC team)
 */
export const REVIEWS_BASE_QUERY_PARAMS = {
  site: 1132,
  type: 1
};
