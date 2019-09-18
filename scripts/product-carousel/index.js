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
 * Product tile carousel button arrow svg
 */
const arrowSvg = $(`.${SLICK_PRODUCT_TILE_CAROUSEL}`).data('arrow-svg');

/**
 * Slick carousel default configuration
 *
 * @see https://kenwheeler.github.io/slick/
 */
const DEFAULT_SLICK_CONFIG = {
  infinite: true
};

/**
 * Determines slidesToShow value
 *
 * @param {Number} windowWidth The width value of the window viewport
 * @return {Number} - How many slides to show
 */
const calcSlidesToShow = windowWidth => {
  /**
   * Responsive slide breakpoints
   *
   * - non-carousel overflow scrolling on small screens
   * - 3 product tiles with previous/arrows on medium screens
   * - 4 product tiles on large screens ( > 960 px )
   * - 5 product tiles on larger screens ( > 1280 px )
   * - 6 product tiles on even larger screens ( > 1480 )
   */
  const slideBreakpoints = [
    {
      start: 0,
      end: 624,
      slidesToShow: 1
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
    prevArrow: `<button type="button" class="de-ProductTileCarousel-button slick-prev">${arrowSvg}</button>`,
    nextArrow: `<button type="button" class="de-ProductTileCarousel-button slick-next">${arrowSvg}</button>`
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
  initCarousels();
  handleWindowResize();
};

init();
