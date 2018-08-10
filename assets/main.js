;(function(window, Cookies, $, Decathlon) {

  /*! 
   * on ready 
   */
  $(function() {
    var decathlon = new Decathlon();
    decathlon.getLocale();
    decathlon.loadImages();

    if ($('body').hasClass('template-product')) {
      decathlon.optionToSwatch();
    }
  });

})(window, Cookies, jQuery, Decathlon);
