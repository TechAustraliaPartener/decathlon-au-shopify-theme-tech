import { IS_ACTIVE_CLASS } from './constants';

/**
 * Throttles a function to only be called a certain interval. Does not pass
 * parameters to callback or preserve callback return value
 * @param {() => any} cb
 * @param {Number} interval
 * @returns {() => void}
 * @template T
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
 * Sets up active state of the active item in the sticky nav
 */
export const init = () => {
  const links = document.querySelectorAll('.de-ProductMenu .de-MenuBar-action');

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

  const screenHeight = window.innerHeight;

  /**
   * Updates the URL hash and links if the user have scrolled to a different
   * section
   */
  const updateScrollState = () => {
    // I _would_ use IntersectionObserver but it isn't supported in IE11 and
    // this is way tinier than a polyfill.
    // reduceRight because we want to _end_ on the items closer to the top
    // because they should have priority over items lower down
    // Loops through the headings, bottom to top, to find the section that is
    // visible at the cutoff of the top ~third of the screen. Since it doesn't
    // know where the sections end, it finds the section that is _right before_
    // the heading that is highest up but still below the cutoff
    const matchingTarget = targets.reduceRight((bestTarget, thisTarget, i) => {
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
    const newHash = `#${matchingTarget ? matchingTarget.id : ''}`;
    // Using pushState instead of window.location.hash because we don't want it to jump
    if (lastHash !== newHash) {
      lastHash = newHash;
      window.history.pushState(null, null, lastHash);
    }
    updateLinksState();
  };
  updateScrollState();

  window.addEventListener('hashchange', updateLinksState);
  window.addEventListener('scroll', throttle(updateScrollState, 100));
};
