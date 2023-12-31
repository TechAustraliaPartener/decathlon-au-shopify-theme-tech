import Swiper, { Navigation, Pagination, Lazy, Autoplay } from 'swiper';

const CAROUSEL_CONTAINER_CLASS = '.swiper_trending_categories_carousel_container';
const SWIPER_NEXT_BUTTON_CLASS = '.swiper-button-next';
const SWIPER_PREV_BUTTON_CLASS = '.swiper-button-prev';
const SWIPER_CAROUSEL_CLASS = '.swiper_trending_categories_carousel';
const SWIPER_SLIDE_CLASS = '.swiper-slide';

function createOnPageResize(swiper) {
  return function() {
    if(window.innerWidth >= 640) {
      swiper.params.loop = true
    } else {
      swiper.params.loop = false;
      swiper.params.freeMode = false;
      swiper.params.slidesPerView = 'auto';
    }

    swiper.update();
  }

}

function initCarousel(element) {
  const nextElement = element.querySelector(SWIPER_NEXT_BUTTON_CLASS);
  const prevElement = element.querySelector(SWIPER_PREV_BUTTON_CLASS);
  const carousel = element.querySelector(SWIPER_CAROUSEL_CLASS);

  const carouselSwiper = new Swiper(carousel, {
    slidesPerView: 'auto',
    spaceBetween: 0,
    lazy: true,
    freeMode: true,
    navigation: {
      nextEl: nextElement,
      prevEl: prevElement,
    },
    breakpoints: {
    },
    on: {
      init: function () {
        $(SWIPER_SLIDE_CLASS).addClass('loaded');
      },
    }
  });
  const onPageResize = createOnPageResize(carouselSwiper);

  

  window.addEventListener('resize', function() {
    onPageResize();
  });
}


function initCarousels() {
  const carouselContainers = document.querySelectorAll(CAROUSEL_CONTAINER_CLASS);

  const carousels = Array.prototype.slice.call(carouselContainers);

  carousels.forEach(carousel => {
    initCarousel(carousel);
  });
}


/**
 * Put all functions that need to run on product-page load here
 */
export const init = () => {
  Swiper.use([Navigation, Pagination, Lazy, Autoplay]);

  initCarousels();
};
