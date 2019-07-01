// @ts-check
import { IS_ACTIVE_CLASS } from './constants';
import { updateHash } from './query-string';

/**
 * Throttles a function to only be called a certain interval. Does not pass
 * parameters to callback or preserve callback return value
 * @param {() => any} cb
 * @param {Number} interval
 * @returns {() => void}
 */
const throttle = (cb, interval) => {
  let runThisTime = false;
  setInterval(() => {
    if (runThisTime) cb();
    runThisTime = false;
  }, interval);
  return () => {
    runThisTime = true;
  };
};

/**
 * Determine which section should be shown in the URL hash based on the scroll position
 * Loops through the headings, bottom to top
 * to find the section that is visible at the cutoff of the top ~third of the screen
 * I _would_ use IntersectionObserver but it isn't supported in IE11 and this is way tinier than a polyfill.
 * Uses `reduceRight` because we want to _end_ on the items closer to the top
 * because they should have priority over items lower down
 * Since it doesn't know where the sections end,
 * it finds the section that is _right before_ the heading that is highest up but still below the cutoff
 * @param {HTMLElement[]} targets
 */
const getMatchingTarget = targets => {
  const screenHeight = window.innerHeight;
  const isAtPageBottom =
    screenHeight + document.documentElement.scrollTop >=
    document.documentElement.scrollHeight;
  // If we have scrolled all the way to the bottom, it should auto-select the last item
  if (isAtPageBottom) return targets[targets.length - 1];
  return targets.reduceRight((bestTarget, thisTarget, i) => {
    // The bottom of the target is the top of the corresponding heading
    const { bottom } = thisTarget.getBoundingClientRect();
    // 0.3 is the cutoff of where it is looking for the active section, it is
    // the % of the way down the screen where it is looking
    const thisItemIsTooLow = bottom > 0.3 * screenHeight;
    if (thisItemIsTooLow) {
      // The next item higher up must be a better choice than any of the items
      // we have seen so far
      return targets[i - 1];
    }
    return bestTarget;
  }, targets[targets.length - 1]);
};

/**
 * Sets up active state of the active item in the sticky nav
 */
export const init = () => {
  const links = document.querySelectorAll('.de-js-StickyMenuItem');

  const targets = [...links].map(link =>
    document.getElementById(link.getAttribute('href').replace(/^#/, ''))
  );

  let lastHash = window.location.hash;

  /**
   * Sets the correct classes on all the sticky nav items
   */
  const updateLinksState = () => {
    [...links].forEach(link => {
      if (link.getAttribute('href') === window.location.hash) {
        link.classList.add(IS_ACTIVE_CLASS);
      } else {
        link.classList.remove(IS_ACTIVE_CLASS);
      }
    });
  };

  /**
   * Updates the URL hash and links if the user have scrolled to a different
   * section
   */
  const updateScrollState = () => {
    const matchingTarget = getMatchingTarget(targets);
    const newHash = `#${matchingTarget ? matchingTarget.id : ''}`;
    // Using replaceState instead of window.location.hash because we don't want it to jump
    if (lastHash !== newHash) {
      lastHash = newHash;
      updateHash(newHash);
    }
    updateLinksState();
  };
  updateScrollState();

  window.addEventListener('hashchange', updateLinksState);
  window.addEventListener('scroll', throttle(updateScrollState, 100));
};
