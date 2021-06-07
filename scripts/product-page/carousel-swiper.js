import Swiper, { Navigation, Pagination, Lazy, Autoplay } from 'swiper';

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

function initFrequentlyBoughtCarousel() {
  const frequentlyBoughtSwiper = new Swiper('.frequently_bought .swiper_products_tile_carousel', {
    slidesPerView: 'auto',
    spaceBetween: 0,
    lazy: true,
    navigation: {
      nextEl: '.frequently_bought .swiper-button-next',
      prevEl: '.frequently_bought .swiper-button-prev',
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
        $('.swiper-slide').addClass('loaded');
      },
    }
  });
  const onPageResize = createOnPageResize(frequentlyBoughtSwiper);

  

  window.addEventListener('resize', function() {
    onPageResize();
  });
}


function initLikeCarousel() {
  const productLikeSwiper = new Swiper('.like_suggest .swiper_products_tile_carousel', {
    slidesPerView: 'auto',
    spaceBetween: 0,
    lazy: true,
    navigation: {
      nextEl: '.like_suggest .swiper-button-next',
      prevEl: '.like_suggest .swiper-button-prev',
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
        $('.swiper-slide').addClass('loaded');
      },
    }
  });
  const onPageResize = createOnPageResize(productLikeSwiper);

  window.addEventListener('resize', function() {
    onPageResize();
  });
}


/**
 * Put all functions that need to run on product-page load here
 */
export const init = () => {
  Swiper.use([Navigation, Pagination, Lazy, Autoplay]);
  initFrequentlyBoughtCarousel();
  initLikeCarousel();
};
