import { IS_ACTIVE_CLASS, JS_PREFIX } from './constants';
import $ from 'jquery';

/**
 * Root element(s)
 */
const CONTAINER_CAROUSEL_SELECTOR = `.${JS_PREFIX}SlickCarouselContainer`;
const CONTAINER_CAROUSEL_ACTIVE_SELECTOR = `${CONTAINER_CAROUSEL_SELECTOR}.${IS_ACTIVE_CLASS}`;
const FEATURE_CAROUSEL_SELECTOR = `.${JS_PREFIX}SlickCarouselFeature`;
const FEATURE_CAROUSEL_ACTIVE_SELECTOR = `${FEATURE_CAROUSEL_SELECTOR}.${IS_ACTIVE_CLASS}`;
const THUMBNAIL_CAROUSEL_SELECTOR = `.${JS_PREFIX}SlickCarouselThumbnail`;
const THUMBNAIL_CAROUSEL_ACTIVE_SELECTOR = `${THUMBNAIL_CAROUSEL_SELECTOR}.${IS_ACTIVE_CLASS}`;
const SLIDE_CAROUSEL_SELECTOR = `.${JS_PREFIX}SlickCarouselSlide`;

/**
 * Global active carousel index
 */
let activeSlideIndex = 0;

/**
 * Partial carousel settings
 */
const THUMB_SLIDES_TO_SHOW = 9;

/**
 * Load carousel images
 */
const loadImages = () => {
  $(SLIDE_CAROUSEL_SELECTOR).each(function() {
    const $slide = $(this);
    if (!$slide.attr('srcset')) {
      const srcset = $slide.data('srcset');
      $slide.attr('srcset', srcset);
    }
    if (!$slide.attr('sizes')) {
      const sizes = $slide.data('sizes');
      $slide.attr('sizes', sizes);
    }
  });
};

/**
 * Returns the slide count of Slick Carousel elements
 *
 * @return {Number} Total slide element count
 */
const getSlideCount = function() {
  let slidesTraversed;
  let swipedSlide;
  const centerOffset =
    this.options.centerMode === true
      ? this.slideWidth * Math.floor(this.options.slidesToShow / 2)
      : 0;
  if (this.options.swipeToSlide === true) {
    /**
     * $slideTrack references the container element for the individual slides
     */
    this.$slideTrack.find('.slick-slide').each((index, slide) => {
      let offsetPoint = slide.offsetLeft;
      let outerSize = $(slide).outerWidth();
      if (this.options.vertical === true) {
        offsetPoint = slide.offsetTop;
        outerSize = $(slide).outerHeight();
      }
      if (offsetPoint - centerOffset + outerSize / 2 > this.swipeLeft * -1) {
        swipedSlide = slide;
        return false;
      }
    });
    slidesTraversed =
      Math.abs($(swipedSlide).attr('data-slick-index') - this.currentSlide) ||
      1;
    return slidesTraversed;
  }
  return this.options.slidesToScroll;
};

/**
 * Returns the available indexes of Slick Carousel slides
 *
 * @returns {Array} Collection of navigable slide indexes
 */
const getNavigableIndexes = function() {
  let breakPoint = 0;
  let counter = 0;
  const indexes = [];
  let max;
  if (this.options.infinite === false) {
    max = this.slideCount;
  } else {
    breakPoint = this.options.slideCount * -1;
    counter = this.options.slideCount * -1;
    max = this.slideCount * 2;
  }
  while (breakPoint < max) {
    indexes.push(breakPoint);
    breakPoint = counter + this.options.slidesToScroll;
    counter +=
      this.options.slidesToScroll <= this.options.slidesToShow
        ? this.options.slidesToScroll
        : this.options.slidesToShow;
  }
  return indexes;
};

/**
 * Slick Carousel bugfix; allows swipeToSlide on vertical orientation
 * @see https://github.com/kenwheeler/slick/issues/1962
 */
const improveCarouselSwipeResponse = () => {
  $(THUMBNAIL_CAROUSEL_ACTIVE_SELECTOR).each(function() {
    this.slick.getSlideCount = getSlideCount;
    this.slick.getNavigableIndexes = getNavigableIndexes;
  });
};

/**
 * Initialize carousel
 */
const initCarousel = () => {
  const $featureCarouselActive = $(FEATURE_CAROUSEL_ACTIVE_SELECTOR);
  const $thumbnailCarouselActive = $(THUMBNAIL_CAROUSEL_ACTIVE_SELECTOR);
  /**
   * Reset index when no image pair
   */
  if (activeSlideIndex >= $featureCarouselActive.children().length) {
    activeSlideIndex = 0;
  }
  /**
   * Visit link for Slick configuration options
   * @see https://kenwheeler.github.io/slick/
   */
  const sharedConfig = {
    arrows: false,
    infinite: true,
    initialSlide: activeSlideIndex
  };
  /**
   * Keep activeSlideIndex in sync with active slide
   */
  $featureCarouselActive.on('afterChange', (event, slick, currentSlide) => {
    activeSlideIndex = currentSlide;
  });
  $featureCarouselActive.slick({
    ...sharedConfig,
    asNavFor: $thumbnailCarouselActive,
    slidesToShow: 1
  });
  $thumbnailCarouselActive.slick({
    ...sharedConfig,
    asNavFor: $featureCarouselActive,
    focusOnSelect: true,
    slidesToShow: THUMB_SLIDES_TO_SHOW,
    vertical: true,
    verticalSwiping: true,
    swipeToSlide: true,
    touchThreshold: 30
  });
  improveCarouselSwipeResponse();
};

/**
 * Add required active classes to elements
 * @param {string} containerClass Class name of container element
 */
const prepCarousel = containerClass => {
  $(containerClass).addClass(IS_ACTIVE_CLASS);
  $(`${containerClass} > ${FEATURE_CAROUSEL_SELECTOR}`).addClass(
    IS_ACTIVE_CLASS
  );
  $(`${containerClass} > ${THUMBNAIL_CAROUSEL_SELECTOR}`).addClass(
    IS_ACTIVE_CLASS
  );
};

/**
 * Destroy and clean up carousel
 */
const destroyCarousel = () => {
  const $containerCarouselActive = $(CONTAINER_CAROUSEL_ACTIVE_SELECTOR);
  const $featureCarouselActive = $(FEATURE_CAROUSEL_ACTIVE_SELECTOR);
  const $thumbnailCarouselActive = $(THUMBNAIL_CAROUSEL_ACTIVE_SELECTOR);
  $featureCarouselActive.slick('unslick');
  $thumbnailCarouselActive.slick('unslick');
  $featureCarouselActive.off();
  $thumbnailCarouselActive.off();
  $featureCarouselActive.removeClass(IS_ACTIVE_CLASS);
  $thumbnailCarouselActive.removeClass(IS_ACTIVE_CLASS);
  $containerCarouselActive.removeClass(IS_ACTIVE_CLASS);
};

/**
 * Watch for window resize event (debounced), refresh carousel
 */
const handleWindowResize = () => {
  let timeout = null;
  $(window).resize(() => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const $featureCarouselActive = $(FEATURE_CAROUSEL_ACTIVE_SELECTOR);
      const $thumbnailCarouselActive = $(THUMBNAIL_CAROUSEL_ACTIVE_SELECTOR);
      // Sync slide index when switching between carousels (desktop vs mobile carousels)
      $featureCarouselActive.slick('slickGoTo', activeSlideIndex);
      $thumbnailCarouselActive.slick('slickGoTo', activeSlideIndex);
    }, 250);
  });
};

/**
 * Reset active carousel to represent new color
 * @param {string} color A product variant color value
 */
export const updateUI = ({ color }) => {
  if (color) {
    const colorLowerCase = color.toLowerCase();
    const containerClass = `${CONTAINER_CAROUSEL_SELECTOR}[data-color="${colorLowerCase}"]`;
    destroyCarousel();
    prepCarousel(containerClass);
    initCarousel();
  }
};

/**
 * Put all functions that need to run on product-page load here
 */
export const init = () => {
  loadImages();
  initCarousel();
  handleWindowResize();
};
