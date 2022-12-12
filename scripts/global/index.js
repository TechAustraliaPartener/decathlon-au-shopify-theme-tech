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
  
  if( container.hasClass('announcement-active') ){
    console.log('POSITIVE')
    $('.de-PageWrap-header').css('top', '30px');
    $('.de-PageWrap-subHeader').css('top', '88px');
  }

  document.addEventListener('scroll', e => {
    if( container.hasClass('announcement-active') ){

      $('#announcement-banner-container').removeClass('announcement-active').addClass('announcement-hidden')

      $('.de-PageWrap-header').css('top', '0px');
      $('.de-PageWrap-subHeader').css('top', '58px');
    }

    // Check if window is at top  
    console.log(window.scrollY)
    if( window.scrollY == 0 ){
      console.log( container )

      if( container.hasClass('announcement-hidden') ){
        console.log( 'is it hidden?' )
        $('#announcement-banner-container').addClass('announcement-active').removeClass('announcement-hidden')
  
        $('.de-PageWrap-header').css('top', '30px');
        $('.de-PageWrap-subHeader').css('top', '88px');
      }
    }
  })

}
$( document ).ready(function() {
  announcement()
  $( "#announcement-close" ).click(function() {
    $('#announcement-banner-container').addClass('hidden')
    $('.de-PageWrap-header').css('top', '0px');
    $('.de-PageWrap-subHeader').css('top', '58px');
  });
});
