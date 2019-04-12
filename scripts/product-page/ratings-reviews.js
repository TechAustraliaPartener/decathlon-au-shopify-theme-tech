/**
 * Ratings & Reviews
 * Uses a Reviews API to fetch ratings and reviews data,
 * renders or re-renders via Handlebars templates onto the page.
 */

import {
  GET_REVIEWS_BASE_URL,
  STAR_RATING_PERCENTAGE_MULTIPLIER,
  REVIEW_VOTE_CLASS
} from './constants';
import Handlebars from 'handlebars';
const tplEl = document.getElementById('de-ReviewMatrix-template');
const containerEl = document.getElementById('de-ReviewMatrix-container');

/**
 * Get product review data for a product by model code
 * @param {string} modelCode A "model code" provided from DEC reviews metafields
 * @returns {Promise<Object>} The review data
 * @throws Will throw if the model code cannot be obtained from the template
 */
const getProductReviewsData = modelCode => {
  if (typeof modelCode !== 'string' || modelCode === '') {
    throw new Error('Cannot fetch product data, misssing model code');
  }
  return fetch(GET_REVIEWS_BASE_URL(modelCode)).then(res => res.json());
};

/**
 * Mapping function - Takes in values from the DEC Reviews API and returns an object for templating context
 * @param {Object} params
 * @param {string|number} params.stars A number of stars given to a set/matrix-row of reviews for a product
 * (e.g., a set of 3-star reviews) -- used to calculate template values for the stars fill, for example
 * @param {Object} params.productReviewsData The entire set of product reviews data from the DEC Reviews API
 * @returns {Object} A set of values to be used as context for a Handlebars template
 */
const setTemplateRatingsMatrixValues = ({ stars, productReviewsData }) => {
  const starsFill = stars * STAR_RATING_PERCENTAGE_MULTIPLIER;
  const starsCount = productReviewsData.notes[stars].count;
  /**
   * `starsPercentage` is the number of ratings for a particular star value (e.g. 4 stars)
   * divided by the total number of ratings for that item,
   * multiplied by 100
   */
  const starsPercentage =
    (starsCount / productReviewsData.total_item_rating_count) * 100;
  return {
    starsFill,
    starsCount,
    starsPercentage
  };
};

/**
 * Adds the RatingsMatrix component
 * Compile a template with update product ratings details (stars, ratings matrix, rating average)
 * and injects into a container that had static output on page load
 * @param {Object} productReviewsData A response from the Decathlon reviews API, based on product model
 */
const renderRatingsMatrix = productReviewsData => {
  const source = tplEl.innerHTML;
  const template = Handlebars.compile(source);
  /**
   * Both notes and total_item_rating_count are part of the return value from the fetch
   * to `https://reviews.decathlon.com/api/en_US/review/list?site=1132&type=1&locales=en&nb=3&offer=${item_number}`
   */
  const context = {
    ratings: Object.keys(productReviewsData.notes)
      .reverse()
      .map(stars =>
        setTemplateRatingsMatrixValues({ stars, productReviewsData })
      )
  };
  const html = template(context);
  containerEl.innerHTML = html;
};

/**
 * Calls to get product ratings and reviews from DEC Reviews API.
 * Passes returned data to a callback that uses a Handlebars template
 * to update an empty Reviews Matrix rendered on page load
 */
const getRatingsInit = () => {
  /**
   * Checks for Handlebars and necessary page elements, then continues if conditions are met
   */
  if (Handlebars && tplEl && containerEl) {
    const modelCode = tplEl.dataset && tplEl.dataset.modelCode;
    getProductReviewsData(modelCode)
      .then(renderRatingsMatrix)
      .catch(error => console.error(error));
  }
};

const voteLinkHandler = event => {
  event.preventDefault();
};

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
  getRatingsInit();
  voteInit();
};

export default init;
