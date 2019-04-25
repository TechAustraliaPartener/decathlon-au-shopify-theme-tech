/**
 * Ratings & Reviews
 * Works with server-rendered reviews on page load.
 * Uses a Reviews API to fetch ratings and reviews data,
 * renders or re-renders via Handlebars templates onto the page.
 */
import { stringify } from 'query-string';
import fetch from 'unfetch';
import Handlebars from 'handlebars';
import {
  REVIEWS_BASE_URL,
  REVIEWS_BASE_QUERY_PARAMS,
  REVIEW_VOTE_CLASS,
  MORE_REVIEWS_CONTAINER_CLASS,
  REVIEW_CLASS,
  REVIEWS_CONTAINER_CLASS,
  REVIEW_PRELOADED_CLASS,
  REVIEWS_CONTAINER_SELECTOR,
  STAR_RATING_PERCENTAGE_MULTIPLIER,
  IS_HIDDEN_CLASS,
  ICON_PREFIX,
  CONTAINER_SUFFIX,
  TEMPLATE_SUFFIX
} from './constants';

/**
 * The model code and, total pre-rendered reviews value, and reviews-per-page value
 * are retrieved from a data attribute in the UI.
 * Model code is necessary for calling the Reviews API
 */
const jsReviewsEl = document.querySelector(`.${REVIEWS_CONTAINER_CLASS}`);
const modelCode = jsReviewsEl && jsReviewsEl.dataset.modelCode;
const totalPrerenderedReviews =
  jsReviewsEl && jsReviewsEl.dataset.totalPrerenderedReviews;
const reviewsPerPage = jsReviewsEl && jsReviewsEl.dataset.reviewsPerPage;
/**
 * Set the query parameter (nb) for number of reviews to request from the API to the value from the template
 */
REVIEWS_BASE_QUERY_PARAMS.nb = reviewsPerPage;
/**
 * Confirm that the total number of pre-rendered reviews is (a number greater than 0 and) evenly divisible by
 * the reviews-per-page number (also a number, greater than 0)
 * If this value is false, it will stop attempts to do paginated API requests (see below)
 */
const validReviewNumbers =
  !isNaN(parseInt(totalPrerenderedReviews, 10)) &&
  !isNaN(parseInt(reviewsPerPage, 10)) &&
  totalPrerenderedReviews > 0 &&
  reviewsPerPage > 0 &&
  totalPrerenderedReviews % reviewsPerPage === 0;

/**
 * STATE MANAGEMENT
 */

/**
 * This will be used for holding state to control load/sort/filter interactions
 */
const originalReviewsState = {
  page: 1,
  reviewsPerPage,
  prerenderedReviews: 0,
  sorted: false,
  filtered: false,
  sort: null,
  filter: null
};

/**
 * Create an initial reviews state object as a clone of the default
 */
let reviewsState = { ...originalReviewsState };

/**
 * Update the reviews state object with one or more new values
 * @param {Object} updateObj Whatever property of the reviews state object needs updating
 */
const setReviewsState = updateObj => {
  // @TODO - Remove comments for production
  console.log('Updating state with the following value(s): ', updateObj);
  reviewsState = { ...reviewsState, ...updateObj };
};

/**
 * TEMPLATING
 * Handlebars templates and containers
 */
const reviewsContainerEl = document.getElementById(
  `${REVIEWS_CONTAINER_SELECTOR}${CONTAINER_SUFFIX}`
);
const reviewsTplEl = document.getElementById(
  `${REVIEWS_CONTAINER_SELECTOR}${TEMPLATE_SUFFIX}`
);
const verifiedPurchaseIconTplEl = document.getElementById(
  `${ICON_PREFIX}verifiedPurchase${TEMPLATE_SUFFIX}`
);
const helpfulIconTplEl = document.getElementById(
  `${ICON_PREFIX}helpful${TEMPLATE_SUFFIX}`
);

/**
 * Register handlebars helpers
 */

/**
 * Output the wrapped markup if any of the conditions are true.
 * @params {*} Values to be tested for truthiness or falsiness
 * Example usage:
 * {{#if_or cond1 cond2 cond3}}
 *  <p>At least one is true</p>
 * {{/if_or}}
 */
Handlebars &&
  Handlebars.registerHelper('if_or', function(...args) {
    const options = args[args.length - 1];
    const vals = args.slice(0, -1);
    const truthy = vals.some(val => Boolean(val));
    if (truthy) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

/**
 * Output a date timestamp formatted as d/m/YYYY
 * @params {string} Timestamp string
 * Example usage:
 * {{date_format some_date_timestamp}}
 */
Handlebars &&
  Handlebars.registerHelper('date_format', function(...args) {
    const timestamp = args[0];
    const date = new Date(timestamp);
    return `${date.getDay() + 1}/${date.getMonth() + 1}/${date.getFullYear()}`;
  });

/**
 * Register handlebars partials (SVG icon snippets) to inject into JS-templated reviews
 */
verifiedPurchaseIconTplEl &&
  Handlebars &&
  Handlebars.registerPartial(
    'verified_purchase_icon',
    verifiedPurchaseIconTplEl.innerHTML
  );
helpfulIconTplEl &&
  Handlebars &&
  Handlebars.registerPartial('helpful_icon', helpfulIconTplEl.innerHTML);

/**
 * Complile the reviews tempate for use after getting new review data
 */
const reviewsTemplateSource = reviewsTplEl && reviewsTplEl.innerHTML;
const reviewsTemplateFn =
  reviewsTemplateSource &&
  Handlebars &&
  Handlebars.compile(reviewsTemplateSource);

/**
 * REVIEWS
 */

/**
 * Get product review data for a product by model code
 * @param {Object} params
 * @param {string} params.modelCode A "model code" provided from DEC reviews metafields
 * @param {Object} [params.queryParams] Extra query parameters to be added to the request (optional)
 * @returns {Promise<Object>} The review data
 * @throws Will throw if the model code cannot be obtained from the template
 */
const getProductReviewsData = ({ modelCode, queryParams }) => {
  if (typeof modelCode !== 'string' || modelCode === '') {
    throw new Error('Cannot fetch product data, misssing model code');
  }
  const params = {
    offer: modelCode,
    ...REVIEWS_BASE_QUERY_PARAMS,
    ...queryParams
  };
  return fetch(`${REVIEWS_BASE_URL}?${stringify(params)}`).then(res =>
    res.json()
  );
};

/**
 * Wrapper for requesting product review data
 * @param {Object} queryParams Additional parameters needed for a particular request (e.g. sort, direction)
 * @returns {Promise<Object>} Data from the request for reviews
 */
const getReviews = queryParams => {
  /**
   * Checks for Handlebars and necessary page elements, then continues if conditions are met
   */
  if (modelCode) {
    return getProductReviewsData({ modelCode, queryParams })
      .then(data => data)
      .catch(error => console.error(error));
  }
  return Promise.reject(
    new Error(`Missing a Model Code. Cannot get new review data.`)
  );
};

/**
 * Unhide a set number of prerendered reviews
 * The number is the same as the number that will used to fetch pages of reviews from the API,
 * after all prerendered reviews are shown
 * @param {Object[]} [reviews=[]] Array of reviews data objects
 */
const showMoreReviews = reviews =>
  reviews
    .filter(review => review.classList.contains(IS_HIDDEN_CLASS))
    .forEach((review, index) => {
      if (index < reviewsPerPage) {
        review.classList.remove(IS_HIDDEN_CLASS);
      }
    });

/**
 * Add a ratings percentage value to each review object
 * @param {Object[]} [reviews=[]] Array of reviews data objects
 * @returns {Object[]} Modified reviews array
 */
const addRatingsPercentage = (reviews = []) =>
  reviews.map(review => {
    if (review.note) {
      // Multiply the note (a.k.a., rating, scale 1-5) by the multiplier to get a percentage value
      review.rating_percentage =
        review.note * STAR_RATING_PERCENTAGE_MULTIPLIER;
    }
    return review;
  });

/**
 * Function that takes in review data and uses a Handlebars compiled template function to
 * render a new set of reviews and insert them into the reviews container element
 * @param {Object[]} [reviews=[]] Review data retrieved from the reviews API
 */
const templateNewReviews = (reviews = []) => {
  /**
   * If the template function or container are missing, just return
   */
  if (
    !(typeof reviewsTemplateFn === 'function') ||
    !(
      reviewsContainerEl &&
      typeof reviewsContainerEl.insertAdjacentHTML === 'function'
    )
  ) {
    return;
  }
  const newReviewsHTML = reviewsTemplateFn({
    reviews: addRatingsPercentage(reviews)
  });
  if (newReviewsHTML) {
    reviewsContainerEl.insertAdjacentHTML('beforeend', newReviewsHTML);
  }
};

/**
 * Fetches reviews from the API and renders the data to the page using a Handlebars templating function
 */
const getMoreReviews = () => {
  /**
   * Get the list of all reviews currently rendered (dynamically loaded and server-rendered)
   */
  const renderedReviewList = document.querySelectorAll(`.${REVIEW_CLASS}`);
  /**
   * Get the number of prerendered reviews currently registered on the state object
   */
  const { prerenderedReviews } = reviewsState;
  /**
   * If there are server-rendered reviews on the page, and not yet any
   * dynamically loaded reviews, set the reviewsState object, page value for the upcoming API call.
   * This number will be the total number of pre-rendered reviews divided
   * by the default paginated value (used in every API call), plus one (the next page)
   */
  if (
    prerenderedReviews > 0 &&
    renderedReviewList.length === prerenderedReviews
  ) {
    setReviewsState({ page: prerenderedReviews / reviewsPerPage + 1 });
  }
  // Get more reviews from the API to display, setting the page value for the call
  getReviews({ page: reviewsState.page })
    .then(data => {
      if (!data || !Array.isArray(data.items)) {
        throw new Error('Review data not succesfully retrieved from the API');
      }
      templateNewReviews(data.items);
    })
    // After successfully updating the template, increment reviewsState.page for the subsequent request
    .then(setReviewsState({ page: reviewsState.page + 1 }))
    .catch(error => console.error(error));
};

/**
 * Handle getting more reviews
 * On page load, this begins by displaying more (hidden) server-rendered reviews,
 * then transitions to loading more from the API.
 * On sorted and filtered lists, will need to immediately go to the API.
 * @TODO implement revisions based on sort and filter state
 * @param {Object} event
 */
const moreReviewsRequestHandler = event => {
  event.preventDefault();
  /**
   * Get the list of server-rendered reviews.
   * This will exist on page load, but will be wiped out and
   * replaced with dynamically loaded reviews on sort or filter
   */
  const prerenderedReviewList = document.querySelectorAll(
    `.${REVIEW_PRELOADED_CLASS}`
  );
  // Convert to Array for running Array helpers on the NodeList
  const prerenderedReviewListArray = [...prerenderedReviewList];
  // Set the length of the prerenderedReviewList on the state object
  setReviewsState({ prerenderedReviews: prerenderedReviewList.length });
  // Get the number of visible, server-rendered reviews
  const visiblePrerenderedReviews = prerenderedReviewListArray.filter(
    review => !review.classList.contains(IS_HIDDEN_CLASS)
  ).length;
  /**
   * If there are server-rendered reviews on the page
   * and the total number exceeds what's visible, just show more
   * (Note: 0 is not GT 0 - if that's the case, there are no server-rendered reviews)
   */
  if (reviewsState.prerenderedReviews > visiblePrerenderedReviews) {
    showMoreReviews(prerenderedReviewListArray);
  } else {
    /**
     * See `validReviewNumbers`. If the total number of pre-rendered reviews (> 0) is not evenly divisible by
     * the default number of reviews per page to load, do not try to make paginated requests for more
     * reviews, and output an error to the console
     */
    if (!validReviewNumbers) {
      console.error(
        'Total number of pre-rendered reviews and reviews-per-page are not in sync. Cannot dynamically calculate paginated requests for more reviews.'
      );
      return;
    }
    /**
     * If we don't have access to Handlebars here, for any reason, abort - will not be able to template new reviews
     */
    if (!Handlebars) {
      console.error(
        'Missing Handlebars. Will not be able render more reviews. Aborting.'
      );
      return;
    }
    /**
     * Need to load and dynamically display reviews after calling the API
     */
    getMoreReviews();
  }
};

/**
 * Entry point for initializing 'Get more reviews' functionality
 */
const moreReviewsInit = () => {
  const moreReviewsEl = document.querySelector(
    `.${MORE_REVIEWS_CONTAINER_CLASS}`
  );
  moreReviewsEl &&
    moreReviewsEl.addEventListener('click', moreReviewsRequestHandler);
};

/**
 * VOTING
 */

/**
 * @TODO implement
 * Placeholder for handling vote links
 * @param {Object} event
 */
const voteLinkHandler = event => {
  event.preventDefault();
};

/**
 * Entry point for review and answer up/down-voting
 */
const voteInit = () => {
  const voteLinks = document.querySelectorAll(`.${REVIEW_VOTE_CLASS}`);
  [...voteLinks].forEach(link =>
    link.addEventListener('click', voteLinkHandler)
  );
};

/**
 * Put all functions that need to run on product-page load here
 */
const init = () => {
  voteInit();
  moreReviewsInit();
};

export default init;
