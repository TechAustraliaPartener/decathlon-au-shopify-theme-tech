import $ from 'jquery';

export const init = () => {
  // Initialize toggles
  $('.faq_accordion_head').on('click', function() {
    const $accordion_parent = $(this).parent('.faq_accordion');
    const $accordion_body = $accordion_parent.find('.faq_accordion_body');

    $accordion_parent.siblings().removeClass('open');
    $accordion_parent.toggleClass('open');

    const headerHeight = $('.de-PageWrap-header').height();
    const productNavHeight = $('.de-ProductMenu').height();
    const totalHeightOffset = headerHeight + productNavHeight;

    if ($accordion_parent.hasClass('open')) {
      setTimeout(() => {
        $('html, body').scrollTop($accordion_body.offset().top - totalHeightOffset);
      }, 300);
    }
  });
};
