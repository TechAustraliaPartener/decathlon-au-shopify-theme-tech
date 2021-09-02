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
