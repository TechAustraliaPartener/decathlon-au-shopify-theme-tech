import { JS_PREFIX } from './constants';
/**
 * @todo Remove jQuery dependency
 */
import $ from 'jquery';

/**
 * Root element(s)
 */
const $slideCarousel = $(`.${JS_PREFIX}CarouselContextSlide`);

/**
 * Load carousel images
 */
const loadImages = () => {
  $slideCarousel.each(function() {
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
 * Put all functions that need to run on product-page load here
 */
export const init = () => {
  loadImages();
};
