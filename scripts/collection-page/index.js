import $ from 'jquery';

function moveRefineSearch() {
  if (window.innerWidth <= 768) {
    if ($('.ais-facets div ul .custom-menu.accordion').length > 0) {
      $('.ais-page').prepend($('.custom-menu.accordion'));
      $('html').css('overflow', 'visible');
      $('.ais-facets-button').text('Show filters');
      $('.ais-facets-button').insertBefore('.ais-facets__shown');
      $('.ais-facets').removeClass('ais-facets__shown');
    }
  } else if ($('.ais-page > .custom-menu.accordion').length > 0) {
    $('.custom-menu.accordion').appendTo('.ais-facets div ul');
    $('.custom-menu.accordion ul').show();
  }
}

window.addEventListener('load', function() {
  const heightDesc = $(
    '.collection-description .description-content div'
  ).height();

  if (heightDesc <= 44) {
    $('.read-more-description').hide();
  }

  if (heightDesc <= 44) {
    $('.read-more-description').hide();
  }

  if ($('.algolia-wrapper').length > 0) {
    moveRefineSearch();
  }

  moveRefineSearch();
});

$(window).resize(function() {
  moveRefineSearch();
});
