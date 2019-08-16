import $ from 'jquery';
import './gateway';

$(document).ready(() => {
  const decathlon = window.decathlon;
  // I think all of this is unused
  const U = $('.sportsSearch .slick-slider');

  function g() {
    const e = U.find('.slick-slide.slick-active');
    U.css('width', e.first().outerWidth(true) * e.length);
  }

  function m() {
    $('body').removeClass('is-showingBanner is-rollingUpBanner');
    $('.popup').remove();
    window.scrollTo(0, 0);
    decathlon.setData('seenBanner', new Date().getTime());
  }

  if (!decathlon.getData('seenBanner') && $('.popup').length > 0) {
    const B = $(window).height();
    $('body').addClass('is-showingBanner');
    $('.popup').css('height', B);
    setTimeout($('.popup-logo').fadeIn(500), 2e3);
    setTimeout($('.popup-content').fadeIn(500), 3e3);
    $('.popup .close-popup-btn').on('click', () => {
      $('body').addClass('is-rollingUpBanner');
      setTimeout(m, 1260);
    });
    $('.popup .js-closePopup').on('click', e => {
      e.preventDefault();
      $('body').addClass('is-rollingUpBanner');
      setTimeout(m, 1260);
    });
    $('.js-seenBanner').on('click', () => {
      decathlon.setData('seenBanner', new Date().getTime());
    });
    $(window).on('scroll', () => {
      if ($(window).scrollTop() > B && $('body').hasClass('is-showingBanner'))
        m();
    });
    $(window).on('resize', () => {
      $('.popup').css('height', $(window).height());
    });
  }

  if ($(window).width() > 1520) g();
});
