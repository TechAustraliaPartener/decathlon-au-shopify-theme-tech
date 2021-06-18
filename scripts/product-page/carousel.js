// @ts-check
import { IS_ACTIVE_CLASS, CSS_UTILITY_PREFIX, JS_PREFIX } from './constants';
// @todo Consider removing jQuery dependency

/**
 * #mk70af
 * Remove declaration of jquery here. Use the global jQuery declaration instead with the global declaration of slick carousel.
 * 
 */

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
const $galleryCounter = $(`.${JS_PREFIX}ProductGallery-countValue`);

/**
 * Global active carousel index
 */
let activeSlideIndex = 0;

/**
 * Boolean check that all carousel slide totals are equal
 */
let allSlideTotalsMatch = true;

/**
 * Main carousel instance
 */
 let $featureCarouselInstance = null;

/**
 * Thumbnail carousel instance
 */
 let $thumbnailCarouselInstance = null; 

/**
 * Partial carousel settings
 */
const THUMB_SLIDES_TO_SHOW = 5;

/**
 * Number of thumbnails that fit within view
 */
const THUMB_SLIDES_SCROLL_GATE = 5;

/**
 * Utility class that adds cursor: grab;
 */
const THUMB_CURSOR_GRAB_CLASS = `${CSS_UTILITY_PREFIX}cursorGrab`;


/**
 * Load carousel images
 */
const loadImages = () => {
  $(`${CONTAINER_CAROUSEL_ACTIVE_SELECTOR} ${SLIDE_CAROUSEL_SELECTOR}`).each(
    function() {
      const $slide = $(this);
      // Remove placeholder background color once image has loaded
      $slide.on('load', function() {
        $slide.removeClass(
          `${CSS_UTILITY_PREFIX}bgSilver ${CSS_UTILITY_PREFIX}bgWhite`
        );
      });
      if (!$slide.attr('srcset')) {
        const srcset = $slide.data('srcset');
        $slide.attr('srcset', srcset);
      }
      if (!$slide.attr('sizes')) {
        const sizes = $slide.data('sizes');
        $slide.attr('sizes', sizes);
      }
      if (!$slide.attr('src')) {
        // This is called data-carousel-src because there is a global script which
        // modifies data-src
        const src = $slide.data('carousel-src');
        $slide.attr('src', src);
      }
    }
  );
};

/**
 * Checks whether all variant slide totals are equal
 */
const initAllSlideTotalsMatch = () => {
  let previousSlideTotal = null;
  $(FEATURE_CAROUSEL_SELECTOR).each((index, featureCarousel) => {
    const slideTotal = $(featureCarousel).children().length;
    if (previousSlideTotal !== null && slideTotal !== previousSlideTotal) {
      allSlideTotalsMatch = false;
      return false;
    }
    previousSlideTotal = slideTotal;
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
      Math.abs(
        Number($(swipedSlide).attr('data-slick-index')) - this.currentSlide
      ) || 1;
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
    // @ts-ignore
    this.slick.getSlideCount = getSlideCount;
    // @ts-ignore
    this.slick.getNavigableIndexes = getNavigableIndexes;
  });
};

/**
 * Counter UI text format helper
 *
 * Formats the counter text for UI display.
 *
 * @param {Object} obj Counter data
 * @param {Number} obj.currentIndex The active index of shown carousel slide
 * @param {Number} obj.total The total count of the active carousel slides
 * @returns {string} Formatted text for UI display
 */
const formatCounterText = ({ currentIndex, total }) =>
  `${currentIndex + 1}/${total}`;

/**
 * Update carousel gallery counter value
 * @param {Object} counterData An object containing counter data
 */
const updateGalleryCounter = counterData => {
  $galleryCounter.text(formatCounterText(counterData));
};

/**
 * Adjust cursor for thumbnails to indicate scrolling when available
 * @param {Number} thumbnailCount The active thumbnail total
 */
const updateThumbnailCursors = thumbnailCount => {
  const buttonElements = $(`${THUMBNAIL_CAROUSEL_ACTIVE_SELECTOR} button`);
  if (thumbnailCount > THUMB_SLIDES_SCROLL_GATE) {
    buttonElements.addClass(THUMB_CURSOR_GRAB_CLASS);
  } else {
    buttonElements.removeClass(THUMB_CURSOR_GRAB_CLASS);
  }
};

/**
 * Initialize carousel
 */
const initCarousel = () => {
  let $featureCarouselActive = null;
  $featureCarouselActive = $(FEATURE_CAROUSEL_ACTIVE_SELECTOR);
  const $thumbnailCarouselActive = $(THUMBNAIL_CAROUSEL_ACTIVE_SELECTOR);
  const activeSlideTotal = $(
    `${FEATURE_CAROUSEL_ACTIVE_SELECTOR}:first ${SLIDE_CAROUSEL_SELECTOR}:not(.slick-cloned)`
  ).length;
  /**
   * Reset index when all slides do not match in length
   */
  if (!allSlideTotalsMatch) {
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
   * Keep gallery counter in sync with active slide value and slide total
   */
  $featureCarouselActive.on('afterChange', (event, slick, currentSlide) => {
    activeSlideIndex = currentSlide;
    updateGalleryCounter({
      currentIndex: activeSlideIndex,
      total: slick.slideCount
    });
  });
  /**
   * On Slick initialization, set gallery counter active slide value and slide total
   */
  $featureCarouselActive.on('init', () => {
    updateGalleryCounter({
      currentIndex: activeSlideIndex,
      total: activeSlideTotal
    });
    loadImages();
    updateThumbnailCursors(activeSlideTotal);
  });

  
  $featureCarouselInstance = $featureCarouselActive.slick({
    ...sharedConfig,
    asNavFor: $thumbnailCarouselActive,
    slidesToShow: 1,
    waitForAnimate: false
  });


  $thumbnailCarouselInstance = $thumbnailCarouselActive.slick({
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


  $featureCarouselInstance.slick('unslick');
  $thumbnailCarouselInstance.slick('unslick');

  $featureCarouselInstance.off();
  $thumbnailCarouselInstance.off();

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
      $featureCarouselInstance.slick('slickGoTo', activeSlideIndex);
      $thumbnailCarouselInstance.slick('slickGoTo', activeSlideIndex);
    }, 250);
  });
};

/**
 * Reset active carousel to represent new color
 * @param {string} color
 */
export const onColorSelect = color => {
  const containerClass = `${CONTAINER_CAROUSEL_SELECTOR}[data-color="${color.toLowerCase()}"]`;
  // Breaking up the work into separate tasks because Slick clogs the main thread a lot

  const timeout1 = setTimeout(() => {
    clearTimeout(timeout1);
    destroyCarousel();
    prepCarousel(containerClass);
  }, 100);
  const timeout2 = setTimeout(() => {
    clearTimeout(timeout2);
    initCarousel();
  }, 150);
};

/**
 * Put all functions that need to run on product-page load here
 */
export const init = () => {
  initAllSlideTotalsMatch();
  initCarousel();
  handleWindowResize();
};
