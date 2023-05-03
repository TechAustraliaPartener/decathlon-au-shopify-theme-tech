const swiper = new Swiper('.swiper', {
  loop: true,
  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
  },
  // autoplay: {
  //   delay: 5000,
  // },

  // Navigation arrows
  // navigation: {
  //   nextEl: '.swiper-button-next',
  //   prevEl: '.swiper-button-prev',
  // },

  on: {
    init: function(e) {
      console.log('swiper initialized...', e)
    }
  }

});
