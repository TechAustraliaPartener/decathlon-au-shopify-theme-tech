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
    fade: true,
    slidesToShow: 1
  });
  $thumbnailCarouselActive.slick({
    ...sharedConfig,
    asNavFor: $featureCarouselActive,
    focusOnSelect: true,
    slidesToShow: THUMB_SLIDES_TO_SHOW,
    vertical: true,
    verticalSwiping: true
  });
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
      // Force thumbails to repaint to prevent overflowing
      $thumbnailCarouselActive.slick('resize');
      // Sync slide index when switching between carousels (desktop vs mobile carousels)
      $featureCarouselActive.slick('slickGoTo', activeSlideIndex);
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
