import Swiper, { Navigation, Pagination, Lazy, Autoplay, Thumbs } from 'swiper';
import Splide from '@splidejs/splide';

const CAROUSEL_CONTAINER_CLASS = '.swiper-product-tile-image-container';

const SPLIDE_CAROUSEL_CLASS = '.main-carousel';
const SPLIDE_THUMBS_CAROUSEL_CLASS = '.thumbnail-carousel';


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
  const mainCarousel = element.querySelector(SPLIDE_CAROUSEL_CLASS);
  const thumbsCarousel = element.querySelector(SPLIDE_THUMBS_CAROUSEL_CLASS);

  const slidesPerViewInThumbs = thumbsCarousel.dataset.variantsCount ? parseInt(thumbsCarousel.dataset.variantsCount) : 4;

  var main = new Splide(mainCarousel, {
    type      : 'fade',
    rewind    : true,
    pagination: false,
    arrows    : true,
  });

  main.on( 'active', function (e) {
    var rootSplide = main.root;
    var productTile = rootSplide.closest('.de-ProductTile');

    var activeSlide = productTile.querySelector('.main-carousel .splide__slide.is-active a');
    var activeSlideURL = activeSlide.getAttribute("href");

    var linksDOM = productTile.querySelectorAll('.de-ProductTile-info .de-u-linkClean');
    var links = Array.prototype.slice.call(linksDOM);  
  
    links.forEach(link => {
      link.href = activeSlideURL;
    });
    
  } );

  var thumbnails = new Splide( thumbsCarousel, {
    // perPage: 4,
    width: slidesPerViewInThumbs > 4 ? 160 : slidesPerViewInThumbs * 40,
    fixedHeight: 40,
    fixedWidth: 40,
    gap         : 0,
    rewind      : true,
    pagination  : false,
    isNavigation: true,
    breakpoints: {
      1024: {
        width: slidesPerViewInThumbs > 4 ? 160 : slidesPerViewInThumbs * 40,
        fixedHeight: 40,
        fixedWidth: 40,
      },
      1280: {
        width: slidesPerViewInThumbs > 4 ? 140 : slidesPerViewInThumbs * 35,
        fixedHeight: 35,
        fixedWidth: 35,
      },
      1366: {
        width: slidesPerViewInThumbs > 4 ? 160 : slidesPerViewInThumbs * 40,
        fixedHeight: 40,
        fixedWidth: 40,
      },
    }
  } );

  main.sync( thumbnails );
  main.mount();
  thumbnails.mount();



  // console.log(element);
  // console.log(prevElement);
  // console.log(nextElement);

  
  // const carouselThumbsSwiper = new Swiper(carouselThumbs, {
  //   slidesPerView: slidesPerViewInThumbs > 4 ? 4 : slidesPerViewInThumbs,
  //   spaceBetween: 0,
  //   lazy: true,
  //   loop: slidesPerViewInThumbs > 4 ? true : false,
  //   // freeMode: slidesPerViewInThumbs > 4 ? true : false,
  //   watchSlidesVisibility: true,
  //   watchSlidesProgress: true,
  //   // navigation: {
  //   //   nextEl: nextThumbsElement,
  //   //   prevEl: prevThumbsElement,
  //   // },
  //   breakpoints: {
  //   }
  // });

  // prevThumbsElement && prevThumbsElement.addEventListener('click', function() {
  //   console.log('hey');
  //   carouselThumbsSwiper.slidePrev();
  // });

  // nextThumbsElement && nextThumbsElement.addEventListener('click', function() {
  //   console.log('hey');
  //   carouselThumbsSwiper.slideNext();
  // });

  // const carouselSwiper = new Swiper(carousel, {
  //   slidesPerView: 1,
  //   spaceBetween: 0,
  //   loop: true,
  //   lazy: true,
  //   // freeMode: true,
  //   navigation: {
  //     nextEl: nextElement,
  //     prevEl: prevElement,
  //   },
  //   breakpoints: {
  //   },
  //   thumbs: {
  //     swiper: carouselThumbsSwiper
  //   },
  //   on: {
  //     init: function () {
  //       $(SWIPER_SLIDE_CLASS).addClass('loaded');
  //     },
  //   }
  // });

  // carouselThumbsSwiper.on("slideChange", () => {
  //   carouselSwiper.slideTo(carouselThumbsSwiper.activeIndex);
  // });

  // // const onPageResize = createOnPageResize(carouselSwiper);

  

  // window.addEventListener('resize', function() {
  //   // onPageResize();
  // });
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
  Swiper.use([Navigation, Pagination, Lazy, Autoplay, Thumbs]);
};

document.addEventListener( 'DOMContentLoaded', function () {
  initCarousels();
})
