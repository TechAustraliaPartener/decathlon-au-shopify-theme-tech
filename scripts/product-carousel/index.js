// @ts-check

import { JS_PREFIX } from '../shared/constants';

/**
 * JQuery is a requirement for the Slick plugin (requires jQuery 1.7 +)
 * @see https://kenwheeler.github.io/slick/#getting-started
 */
import $ from 'jquery';

/**
 * Product tile carousel selector
 */
const SLICK_PRODUCT_TILE_CAROUSEL = `${JS_PREFIX}SlickProductTileCarousel`;

/**
 * Product tile showcase selector
 */
const PRODUCT_TILE_SHOWCASE = `${JS_PREFIX}ProductTile-showcase`;

/**
 * Product tile carousel button arrow svg
 */
const arrowPreviousButton = $(`.${SLICK_PRODUCT_TILE_CAROUSEL}`).data(
  'arrow-previous-button'
);
const arrowNextButton = $(`.${SLICK_PRODUCT_TILE_CAROUSEL}`).data(
  'arrow-next-button'
);

const slideBreakpointsType = $(`.${SLICK_PRODUCT_TILE_CAROUSEL}`).data('slide-breakpoints-type');

/**
 * Slick carousel default configuration
 *
 * @see https://kenwheeler.github.io/slick/
 */
const DEFAULT_SLICK_CONFIG = {
  infinite: true
};

/**
 * The "mode" is the number that is repeated most often
 *
 * For example, the "mode" of [3, 5, 4, 4, 1, 1, 2, 3] is [1, 3, 4]
 *
 * @param {Array} numbers An array of numbers
 * @returns {String} The mode of the specified numbers
 */
const findMode = numbers => {
  const counted = numbers.reduce((acc, curr) => {
    if (curr in acc) {
      acc[curr]++;
    } else {
      acc[curr] = 1;
    }

    return acc;
  }, {});

  return Object.keys(counted).reduce((prev, curr) =>
    counted[prev] > counted[curr] ? prev : curr
  );
};

/**
 * Sets all image containers to an equal height
 */
const standardizeImageContainers = () => {
  const containers = /** @type {HTMLElement[]} */ ([
    ...document.querySelectorAll(`.${PRODUCT_TILE_SHOWCASE}`)
  ]);
  const mode = findMode(
    containers.map(el => {
      el.style.height = 'initial';
      return el.offsetHeight;
    })
  );
  // Set element height to mode value of siblings
  containers.forEach(el => {
    el.style.height = `${mode}px`;
  });
};

/**
 * Determines slidesToShow value
 *
 * @param {Number} windowWidth The width value of the window viewport
 * @returns {Number} - How many slides to show
 */
const calcSlidesToShow = windowWidth => {
  let slideBreakpoints;

  if (slideBreakpointsType === 'associated-products') {
    slideBreakpoints = [
      {
        start: 0,
        end: 624,
        slidesToShow: 0
      },
      {
        start: 625,
        end: 99999,
        slidesToShow: 3
      }
    ];
  } else {
    /**
     * Responsive slide breakpoints
     *
     * - non-carousel overflow scrolling on small screens
     * - 3 product tiles with previous/arrows on medium screens
     * - 4 product tiles on large screens ( > 960 px )
     * - 5 product tiles on larger screens ( > 1280 px )
     * - 6 product tiles on even larger screens ( > 1480 )
     */
    slideBreakpoints = [
      {
        start: 0,
        end: 624,
        slidesToShow: 0
      },
      {
        start: 625,
        end: 960,
        slidesToShow: 3
      },
      {
        start: 961,
        end: 1280,
        slidesToShow: 4
      },
      {
        start: 1281,
        end: 1480,
        slidesToShow: 5
      },
      {
        start: 1481,
        end: 99999,
        slidesToShow: 6
      }
    ];
  }

  const activeSlideBreakpoint = slideBreakpoints.find(
    breakpoint =>
      windowWidth >= breakpoint.start && windowWidth <= breakpoint.end
  );

  return activeSlideBreakpoint ? activeSlideBreakpoint.slidesToShow : 0;
};

/**
 * Initializes all product tile carousels
 */
const initCarousels = () => {
  const slidesToShow = calcSlidesToShow($(window).width());
  /**
   * Slick carousel configuration
   */
  const config = {
    ...DEFAULT_SLICK_CONFIG,
    slidesToShow,
    slidesToScroll: slidesToShow,
    prevArrow: arrowPreviousButton,
    nextArrow: arrowNextButton
  };

  /**
   * Destroy all already initialized carousels
   * This prevents thrown errors, if it were to be initialized twice
   */
  $(`.${SLICK_PRODUCT_TILE_CAROUSEL}.slick-initialized`).slick('unslick');

  /**
   * Create a slick carousel instance
   */
  if (slidesToShow > 0) {
    $(`.${SLICK_PRODUCT_TILE_CAROUSEL}`)
      .not('.slick-initialized')
      .slick(config);
  }

  /**
   * Sets all image container heights to their mode value
   */
  standardizeImageContainers();
};

/**
 * Watch for the window resize event (debounced), then initialize carousel
 */
const handleWindowResize = () => {
  let timeout = null;
  $(window).resize(() => {
    clearTimeout(timeout);
    timeout = setTimeout(initCarousels, 250);
  });
};

/**
 * Initialize carousel to start things off
 */
const init = () => {
  const $productTileCarousel = $(`.${SLICK_PRODUCT_TILE_CAROUSEL}`);
  if ($productTileCarousel.length > 0) {
    initCarousels();
    handleWindowResize();
  }
};

init();
