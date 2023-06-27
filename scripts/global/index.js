(function() {

  window.lazyFunctions = {
    onTrendingCategoryImageLoad: function (element) {
      const trendingCategoryTile = element.closest('.trending_category_tile');
      trendingCategoryTile.classList.add('lazy_loaded');
    },
  };

  function executeLazyFunction(element) {
    var lazyFunctionName = element.getAttribute("data-lazy-function");
    var lazyFunction = window.lazyFunctions[lazyFunctionName];
    if (!lazyFunction) return;
    lazyFunction(element);
  }

  // Vanilla Lazyload
  // https://github.com/verlok/vanilla-lazyload#-getting-started
  var lazyLoadInstance = new LazyLoad({
    callback_loaded: executeLazyFunction
  });
})();

// FOR ANNOUNCEMENT BANNER

$(document).ready(function() {
  // Reference for vertical text slider- https://github.com/anuptamang/text-animate-vertical
  var verticalTextSliderContainer = document.querySelector('.vertical_text_slider');//$('.vertical_text_slider');
  var verticalTextItems = document.querySelectorAll('.vertical_text_item');//$('.vertical_text_item');
  var animIn = 'anim-in';
  var animOut = 'anim-out';
  
  var timeoutAnimation;
  var nextItem = null;
  var prevItem = null;
  var counter = 0;
  var firstLoad = false;
  var delay = parseInt(window.vars.rotatingAnnouncementsDelay) + parseInt(window.vars.rotatingAnnouncementsSpeed / 2);
  var speed = window.vars.rotatingAnnouncementsSpeed / 1000;

  $('.vertical_text_item').css('animation-duration', `${speed}s`);

  if (verticalTextSliderContainer.children.length > 1) {
    startRotation();
  }

  function startRotation() {
    clearTimeout(timeoutAnimation);

    timeoutAnimation = setTimeout(function() {
      if (prevItem !== null) {
        prevItem.classList.add(animOut);
      }
      nextItem = verticalTextSliderContainer.getElementsByClassName('vertical_text_item')[counter];

      nextItem.classList.remove(animOut);
      if (firstLoad) {
        nextItem.classList.add(animIn);
      }
      prevItem = nextItem;

      firstLoad = true;

      if (counter === verticalTextItems.length - 1) {
        counter = 0;
      } else {
        counter++;
      }
      startRotation();
    }, firstLoad ? delay : 100);
  }
});

//  For conditional styling of announcement banner

function announcement(){
  const container = $('#announcement-banner-container');

  let announcementChecker = sessionStorage.getItem("announcement");
  if (announcementChecker){
    if( container.hasClass('announcement-active') ){
      $('.de-PageWrap-header').css('top', '30px');
      $('.de-PageWrap-subHeader').css('top', '88px');
      $('.de-PageWrap-prioritySportNav').css('top', '136.448px');
      $('.template-search  .de-PageWrap-main.sticky-sort-filter').css('padding-top', '76px');

      
      $('.template-collection').addClass('with-announcement-banner');
      $('.template-search').addClass('with-announcement-banner');
      $('.template-product').addClass('with-announcement-banner');
      $('.template-page').addClass('with-announcement-banner');
      $('.searchbar-overlay').addClass('with-announcement-banner');

    }
    document.addEventListener('scroll', e => {
      if( container.hasClass('announcement-active') ){

        $('#announcement-banner-container').removeClass('announcement-active').addClass('announcement-hidden')

        $('.de-PageWrap-header').css('top', '0px');
        $('.de-PageWrap-subHeader').css('top', '58px');
        $('.de-PageWrap-prioritySportNav').css('top', '106.448px');
        $('.de-PageWrap-main.sticky-sort-filter').css('padding-top', '46px');
        $('.de-PageWrap-main.sticky-sort-filter').css('padding-top', '46px');
        $('.template-search  .de-PageWrap-main.sticky-sort-filter').css('padding-top', '46px');
        $('.template-collection').removeClass('with-announcement-banner');
        $('.template-search').removeClass('with-announcement-banner');
        $('.template-product').removeClass('with-announcement-banner');
        $('.template-page').removeClass('with-announcement-banner');
        $('.searchbar-overlay').removeClass('with-announcement-banner');
        
      }

      // Check if window is at top  
      if( window.scrollY == 0 ){
        if( container.hasClass('announcement-hidden') ){
          $('#announcement-banner-container').show();
          $('#announcement-banner-container').addClass('announcement-active').removeClass('announcement-hidden')
    
          $('.de-PageWrap-header').css('top', '30px');
          $('.de-PageWrap-subHeader').css('top', '88px');
          $('.de-PageWrap-prioritySportNav').css('top', '136.448px');
        $('.template-search  .de-PageWrap-main.sticky-sort-filter').css('padding-top', '76px');

          
          $('.template-collection').addClass('with-announcement-banner');
          $('.template-search').addClass('with-announcement-banner');
          $('.template-product').addClass('with-announcement-banner');
          $('.template-page').addClass('with-announcement-banner');
          $('.searchbar-overlay').addClass('with-announcement-banner');

        } else{
          $('#announcement-banner-container').hide();
        }
      }
    })
  }
}
$( document ).ready(function() {
  let announcementChecker = sessionStorage.getItem("announcement");
  if (announcementChecker == 'true' || announcementChecker == null){
      $('#announcement-banner-container').show();
      $('#announcement-banner-container').addClass('announcement-active');
      // Make sure this class exists for the new hero banner section to work correctly
      $('.de-PageWrap-main').addClass('de-PageWrap-main--announcement-active');
      sessionStorage.setItem("announcement", true);
      announcement();
      $( "#announcement-close" ).click(function() {
        $('.de-PageWrap-header').css('top', '0px');
        $('.de-PageWrap-subHeader').css('top', '58px');
        $('.de-PageWrap-prioritySportNav').css('top', '106.448px');
        $('.template-search .de-PageWrap-main').css('top', '76px');
        $('.de-PageWrap-main').removeClass('de-PageWrap-main--announcement-active');
        $('.template-collection').removeClass('with-announcement-banner');
        $('.template-search').removeClass('with-announcement-banner');
        $('.template-product').removeClass('with-announcement-banner');
        $('.template-page').removeClass('with-announcement-banner');
        $('.searchbar-overlay').removeClass('with-announcement-banner');
        $('#announcement-banner-container').removeClass('announcement-active');
        $('#announcement-banner-container').hide();
        sessionStorage.setItem("announcement", false);
      });
  } else{
    $('#announcement-banner-container').hide();
  }
});
$(window).bind('load', function() {
  var $filterCount = $('.ais-current-refined-values--item').length;
  if ( $filterCount > 0 ){
    $('.ais-facets-button').append(' ('+ $filterCount + ')')
  }

})

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

function showMoreInViewport(obj){

  // FOR infinitHits && Pagination
  if ($('#ais_banner_container').length > 0){
    var documentViewTop = $(window).scrollTop();
    var documentViewBottom = documentViewTop + $(window).height();

    var elementTop = $(obj).offset().top;
    var elementBottom = elementTop + $(obj).height();

    return ((elementBottom <= documentViewBottom) && (elementTop >= documentViewTop));
  }
}

// Implement debounce to prevent accidental multiple jquery triggers that causes the pagination to jump to pages beyond what algolia offers.
$(window).scroll(debounce(function(){
  if (showMoreInViewport($('.ais-hits--showmore'))){
    // $('.ais-hits--showmore button')
    if($('.ais-hits--showmore button').attr('disabled') !== 'disabled') {
      $('.ais-hits--showmore button').trigger('click');
    } else{
      $('#end-results-container').removeClass('hidden');
      $('.ais-hits--showmore button').hide();
      $('#collection-search-preloader').addClass('hidden')
    }
  } else{
    if(!$('#collection-search-preloader').hasClass('hidden')){
      $('#collection-search-preloader').addClass('hidden')
    }
  }
}, 250));

$(window).scroll(debounce(function(){
  if (showMoreInViewport($('.ais-hits--showmore'))){
    showPreloader();
  }
}, 100));

function showPreloader() {
  if($('#collection-search-preloader').hasClass('hidden') && $('.ais-hits--showmore button').attr('disabled') !== 'disabled'){
    $('#collection-search-preloader').removeClass('hidden')
  }
}
