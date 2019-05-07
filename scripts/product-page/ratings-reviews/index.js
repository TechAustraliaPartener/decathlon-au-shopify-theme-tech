/**
 * Ratings & Reviews
 * Works with server-rendered reviews on page load.
 * Uses a Reviews API to fetch ratings and reviews data,
 * renders or re-renders via Handlebars templates onto the page.
 */

import { setPrerenderedReviewsOnState } from './state';
import { moreReviewsInit } from './update-ui';
import { handlebarsInit } from './templating';
import { reviewsSortInit } from './sorting';
import { reviewsVoteInit } from './voting';
import { reviewsFilteringInit } from './filtering';

/**
 * Put all functions that need to run on product-page load here
 * 1. Register Handlebars partials and helpers
 * 2. Initialize handling for displaying (and fetching) more reviews
 * 3. Initialize handling for sorting reviews
 * 4. Initialize handling of voting for reviews and answers
 */
export const reviewsInit = () => {
  setPrerenderedReviewsOnState();
  handlebarsInit();
  moreReviewsInit();
  reviewsSortInit();
  reviewsVoteInit();
  reviewsFilteringInit();
};
