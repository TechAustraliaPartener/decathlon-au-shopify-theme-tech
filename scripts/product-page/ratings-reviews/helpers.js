import { STAR_RATING_PERCENTAGE_MULTIPLIER } from './constants';

/**
 * Add a ratings percentage value to each review object
 * @param {Object[]} [reviews=[]] Array of reviews data objects
 * @returns {Object[]} Modified reviews array
 */
export const addRatingsPercentage = (reviews = []) =>
  reviews.map(review => {
    if (review.note) {
      // Multiply the note (a.k.a., rating, scale 1-5) by the multiplier to get a percentage value
      review.rating_percentage =
        review.note * STAR_RATING_PERCENTAGE_MULTIPLIER;
    }
    return review;
  });
