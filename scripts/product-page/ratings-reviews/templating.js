import Handlebars from 'handlebars';
import {
  ICON_PREFIX,
  TEMPLATE_SUFFIX,
  REVIEWS_CONTAINER_SELECTOR,
  CONTAINER_SUFFIX,
  VERIFIED_PURCHASE_ICON_TEMPLATE_ID,
  VOTING_ICON_TEMPLATE_ID
} from './constants';
import { addRatingsPercentage } from './helpers';

/**
 * A wrapper to check the existence of Handlebars before running code that expects it (an unchecked external gloabal defined in Rollup)
 * @param {function} callback A function to call if Handlebars exists
 * @returns {function} A function that takes any params and executes the callback, or a noop if Handlebars isn't available
 * @example handlebarsCheck(myFunction)([parameters])
 */
export const handlebarsCheck = callback =>
  Handlebars
    ? function(params) {
        callback(params);
      }
    : function() {
        console.error('Cannot load new reviews. Missing templating engine.');
        return false;
      };

/**
 * Closure for containing caching variables around the exported function, templateNewReviews
 */
const _templateNewReviews = () => {
  /**
   * Create naive cache for reused elements and variables used in templating
   */
  let reviewsContainerEl = null;
  let reviewsTplEl = null;
  let reviewsTemplateFn = null;
  let reviewsTemplateSource = null;
  /**
   * Function that takes in review data and uses a Handlebars compiled template function to
   * render a new set of reviews and insert them into the reviews container element
   * @param {Object[]} [reviews=[]] Review data retrieved from the reviews API
   * @returns (*) rendered HTML
   */
  return (reviews = []) => {
    /**
     * Get Handlebars templates and containers, used cached values when set
     */
    reviewsTplEl =
      reviewsTplEl ||
      document.getElementById(
        `${REVIEWS_CONTAINER_SELECTOR}${TEMPLATE_SUFFIX}`
      );
    reviewsContainerEl =
      reviewsContainerEl ||
      document.getElementById(
        `${REVIEWS_CONTAINER_SELECTOR}${CONTAINER_SUFFIX}`
      );
    /**
     * Compile the reviews template for use after getting new review data
     */
    reviewsTemplateSource =
      reviewsTemplateSource || (reviewsTplEl && reviewsTplEl.innerHTML);
    reviewsTemplateFn =
      reviewsTemplateFn ||
      (reviewsTemplateSource && Handlebars.compile(reviewsTemplateSource));
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
      throw new Error(
        'We do not have a Handlebars templating function or a viable container for rendering.'
      );
    }
    const newReviewsHTML = reviewsTemplateFn({
      reviews: addRatingsPercentage(reviews)
    });
    if (newReviewsHTML) {
      return reviewsContainerEl.insertAdjacentHTML('beforeend', newReviewsHTML);
    }
    throw new Error('Templating new reviews failed');
  };
};

/**
 * Exports the closured function with caching
 */
export const templateNewReviews = _templateNewReviews();

/**
 * An initialization function for registering Handlebars partials and helpers
 */
const _handlebarsInit = () => {
  /**
   * Get elements for registering partials
   */
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
  Handlebars.registerHelper('date_format', function(...args) {
    const timestamp = args[0];
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  });

  /**
   * Register handlebars partials (SVG icon snippets) to inject into JS-templated reviews
   */
  if (verifiedPurchaseIconTplEl) {
    Handlebars.registerPartial(
      VERIFIED_PURCHASE_ICON_TEMPLATE_ID,
      verifiedPurchaseIconTplEl.innerHTML
    );
  }
  if (helpfulIconTplEl) {
    Handlebars.registerPartial(
      VOTING_ICON_TEMPLATE_ID,
      helpfulIconTplEl.innerHTML
    );
  }
};

export const handlebarsInit = handlebarsCheck(_handlebarsInit);
