/* eslint-disable indent */
/* eslint-disable no-console */
import $ from 'jquery';
import Cookies from 'js-cookie';


export const init = () => {
  const productsJSON = window.productJSON;

  const $section = $('.recently_viewed_products');
  const $container = $('#recently_viewed_products_container');
  const handleOfCurrentProduct = productsJSON.handle;
  const productLimit = parseInt($('#recently_viewed_products_container').data('max-items'), 10);
  
  const cookieValue = `product_viewed_${handleOfCurrentProduct}`;
  Cookies.set(cookieValue);

  const recentlyViewedProducts = [];
  $.each(document.cookie.split(/; */), function()  {
    const splitCookie = this.split('=');
    // Name is splitCookie[0], value is splitCookie[1]
    const name = splitCookie[0];

    if(name.includes('product_viewed_')) {
      recentlyViewedProducts.push(name);
    }
  });

  const recentlyViewedProductHandles = recentlyViewedProducts.map(product => {
    return product.replace('product_viewed_', '');
  }).filter(product => {
    return product !== handleOfCurrentProduct;
  });

  // Hide section if no recently viewed products
  if (recentlyViewedProductHandles.length === 0) {
    $('#shopify-section-recently-viewed-products').hide();
    $('#recently-viewed-products-section').hide();
    return;
  } 
  $('#recently-viewed-products-section').show();
  

  const calcSlidesToShow = windowWidth => {
    const slideBreakpoints = [
      {
        start: 0,
        end: 624,
        slidesToShow: 2
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

  const mappedRVProducts = recentlyViewedProductHandles
    .map(handle => {
      const deferred = $.Deferred();
    
      $.get(`/products/${handle}?view=nolayout.tile`)
        .done(data => deferred.resolve(data))
        .fail(() => {
          Cookies.remove(`product_viewed_${handle}`);
          deferred.resolve('');
        });

      return deferred;
    });

  $.when(...mappedRVProducts).done((...data) => {
    const html = data.filter(html => html !== '').slice(0, productLimit);

    $section.show();
    $container.append(html);

    const $loading = $('#recently_viewed_products_loading');
    $loading.remove();

    $container.removeClass('row');
    $container.find('.product_tile').removeClass(function(index, className) {
      return (className.match (/(^|\s)col-\S+/g) || []).join(' ');
    });

    const arrowPreviousButton = $container.data('arrow-previous-button');
    const arrowNextButton = $container.data('arrow-next-button');
    const slidesToShow = calcSlidesToShow($(window).width());


    $container.slick({
      centerMode: false,
      infinite: true,
      slidesToShow,
      slidesToScroll: slidesToShow,
      dots: true,
      prevArrow: arrowPreviousButton,
      nextArrow: arrowNextButton,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            dots: false
          }
        }
      ]

    });

    // In phone view show half of the next slide
    if($(window).width() < 640) {
      $container.find('.slick-list').css('padding', '0 10% 0 0');
    }
    setTimeout(() => {
      $container.children('article').remove();
    }, 100);
  });
};
