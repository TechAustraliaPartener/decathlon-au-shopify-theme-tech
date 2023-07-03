const swiper = new Swiper('.hero-banner', {
  loop: true,
  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  autoplay: true,

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },


  on: {
    init: function(e) {
      console.log('swiper initialized...', e)
    }
  }

});
