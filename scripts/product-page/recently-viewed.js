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
    return;
  }

  Promise.all(
    recentlyViewedProductHandles.map((handle) => {
      const failCallback = function() {
        // eslint-disable-next-line prefer-template
        Cookies.remove('product_viewed_' + handle);
      };

      // eslint-disable-next-line prefer-template
      return $.get('/products/'+ handle + '?view=nolayout.tile')
        .done(data => {
          return data;
        })
        .fail(error => {
          if (error.status === '404') {
            failCallback();
          }
          return '';
        });
    })
  ).then(data => {
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

    $container.slick({
      centerMode: false,
      infinite: true,
      slidesToShow: 4,
      slidesToScroll: 1,
      dots: true,
      prevArrow: arrowPreviousButton,
      nextArrow: arrowNextButton,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        }
      ]
    });
  });
};
