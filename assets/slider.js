window.timberSlider = window.timberSlider || {};

timberSlider.cacheSelectors = function () {
  timberSlider.cache = {
    // Home Page
    $slider: $('.flexslider')
  }
};

timberSlider.init = function () {
  timberSlider.cacheSelectors();
  timberSlider.sliders();
};

timberSlider.sliders = function () {
  var $slider = timberSlider.cache.$slider,
      sliderArgs = {
        animation: '',
        animationSpeed: 500,
        pauseOnHover: true,
        keyboard: false,
        slideshow: ,
        slideshowSpeed: ,
        controlNav: ,
        smoothHeight: true
      };

  if ($slider.length) {

    if ($slider.find('li').length === 1) {
      sliderArgs.slideshow = false;
      sliderArgs.slideshowSpeed = 0;
      sliderArgs.controlNav = false;
      sliderArgs.directionNav = false;
    }

    $slider.flexslider(sliderArgs);
  }
};

// Initialize slider on docready
$(window).on('load', function() {
  timberSlider.init();
});
