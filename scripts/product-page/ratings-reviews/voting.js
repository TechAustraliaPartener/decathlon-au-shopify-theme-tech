/**
 * VOTING
 *
 * Module for registering up- or down-votes (helpful or not helpful) on review and answers
 */

import { REVIEW_VOTE_CLASS } from './constants';

/**
 * @TODO implement
 * Placeholder for handling vote links
 * @param {Object} event
 */
const voteLinkHandler = event => {
  console.log('voteLinkHandler called');
  console.log(event.target.dataset.reviewVoteUrl);
};

/**
 * Entry point for review and answer up/down-voting
 */
export const reviewsVoteInit = () => {
  document.addEventListener('click', function(event) {
    if (event.target.matches(`.${REVIEW_VOTE_CLASS}`)) {
      voteLinkHandler.call(event.target, event);
    }
  });
};
