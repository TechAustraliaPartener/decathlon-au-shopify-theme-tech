// @ts-check

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
export const MORE_REVIEWS_BUTTON_CLASS = `${JS_PREFIX}moreReviewsButton`;

/**
 * The CSS class on the button used to get more reviews
 */
export const MORE_REVIEWS_BUTTON_TEXT_CLASS = `${MORE_REVIEWS_BUTTON_CLASS}-text`;

/**
 * The CSS class on the button used to get more reviews
 */
export const MORE_REVIEWS_BUTTON_LOADING_TEXT_CLASS = `${MORE_REVIEWS_BUTTON_CLASS}-loadingText`;

/**
 * The CSS class on the button used to get more reviews
 */
export const REVIEWS_LOADING_CLASS = `${JS_PREFIX}LoadingReviews`;

/**
 * Timeout for delaying showing loading state after calls to the revies API
 */
export const REVIEWS_LOADING_TIMEOUT = 200;

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
 * The CSS class on the reviews sort select
 */
export const REVIEW_SORT_SELECT = `${JS_PREFIX}${CUSTOMER_REVIEW}-sort`;

/**
 * The CSS class on reviews rating elements (assigned a star-rating value)
 */
export const REVIEW_FILTER = `${JS_PREFIX}${CUSTOMER_REVIEW}-filter`;

/** The CSS class on the element that displays the current filter if it exists */
export const REVIEW_FILTER_STATUS = `${JS_PREFIX}${CUSTOMER_REVIEW}-filterStatus`;

/** The CSS class on the element within the filter status that shows the number of stars */
export const REVIEW_FILTER_STAR_VALUE = `${JS_PREFIX}${CUSTOMER_REVIEW}-filterStarValue`;

/** The CSS class on the clear filter button */
export const REVIEW_CLEAR_FILTER = `${JS_PREFIX}${CUSTOMER_REVIEW}-clearFilter`;

/** The CSS class on the review summary text (N out of 5 stars). This gets used as a clear button as well */
export const REVIEW_SUMMARY_CLEAR_FILTER = `${JS_PREFIX}ReviewSummary-starsSummary`;

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
export const LOGO_WITHOUT_BACKGROUND_TEMPLATE_ID = 'logo_no_bg';

/**
 * Element dataset variables
 */

/**
 * Star rating value from rows in the review matrix, for filtering
 */
export const STAR_RATING = 'starRating';
