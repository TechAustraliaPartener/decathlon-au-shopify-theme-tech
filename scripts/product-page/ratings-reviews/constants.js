import { JS_PREFIX, CSS_PREFIX } from '../constants';

/**
 * Re-export all higher-level constants
 */
export * from '../constants';

/**
 * Reviews-specific values
 */

export const CUSTOMER_REVIEW = 'CustomerReview';

/**
 * The CSS class used on links to up- or down-vote a review or answer
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
 * Multiplier for converting ratings stars (1-5) to a percentage
 */
export const STAR_RATING_PERCENTAGE_MULTIPLIER = 20;

/**
 * Base URL for querying the Decathlon Reviews API
 */
export const REVIEWS_BASE_URL =
  'https://reviews.decathlon.com/api/en_US/review/list';

/**
 * Base query parameters for the Decathlon Reviews API
 */
export const REVIEWS_BASE_QUERY_PARAMS = {
  site: 1132,
  type: 1
};

/**
 * Constants used for Handlebars partials
 */

export const VERIFIED_PURCHASE_ICON_TEMPLATE_ID = 'verified_purchase_icon';
export const VOTING_ICON_TEMPLATE_ID = 'helpful_icon';
