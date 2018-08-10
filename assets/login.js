function moveSignInButtons() {
  var pageWidth = $(window).width();
  if (pageWidth <= 366) {
    $('.guest-account').removeClass('left').addClass('center');
    $('.create-account').removeClass('right').addClass('center');
  } else {
    $('.guest-account').removeClass('center').addClass('left');
    $('.create-account').removeClass('center').addClass('right');
  }
};

$(window).on('load', function() {
  console.log('page loaded');
  moveSignInButtons();
  $('.create-account').show();
  $('.guest-account').show();
});
$(window).on('resize', function() {
  console.log('page resized');
  moveSignInButtons();
});