import Swiper, { Navigation, Pagination, Lazy, Autoplay } from 'swiper';

const CAROUSEL_CONTAINER_CLASS = '.swiper_products_tile_carousel_container';
const SWIPER_NEXT_BUTTON_CLASS = '.swiper-button-next';
const SWIPER_PREV_BUTTON_CLASS = '.swiper-button-prev';
const SWIPER_CAROUSEL_CLASS = '.swiper_products_tile_carousel';
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

  console.log(nextElement, prevElement, carousel);

  const carouselSwiper = new Swiper(carousel, {
    slidesPerView: 'auto',
    spaceBetween: 0,
    lazy: true,
    navigation: {
      nextEl: nextElement,
      prevEl: prevElement,
    },
    breakpoints: {
      640: {// when window width is >= 640px
        freeMode: false,
        slidesPerView: 3,
        slidesPerGroup: 3,
        centeredSlides: false,
        centeredSlidesBounds: false,
        loop: true
      },
      1024: { 
        freeMode: false,
        slidesPerView: 4,
        slidesPerGroup: 4,
        centeredSlides: false,
        centeredSlidesBounds: false,
        loop: true
      },
      1300: { 
        freeMode: false,
        slidesPerView: 5,
        slidesPerGroup: 5,
        centeredSlides: false,
        centeredSlidesBounds: false,
        loop: true
      },
      1600: { 
        freeMode: false,
        slidesPerView: 6,
        slidesPerGroup: 6,
        centeredSlides: false,
        centeredSlidesBounds: false,
        loop: true
      }
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
