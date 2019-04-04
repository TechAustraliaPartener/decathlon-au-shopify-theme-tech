const $ = window.jQuery;

// Create carousel with videos
$('.de-js-slick--videos').slick({
  dots: true,
  arrows: false
});

// Attach click event to 'Watch Videos' button to toggle between video and image
$('.de-js-watch-video-button').click(toggleWatchVideo);

// Function to toggle between 'Watch Videos' and 'View Images'
function toggleWatchVideo() {
  if ($(this).hasClass('de-js-toggle')) {
    // Remove Video, switch to Images
    $(this).removeClass('de-js-toggle');
    $('.de-js-watch-video.hide').removeClass('hide');
    $('.de-js-view-images').addClass('hide');
    $('.de-js-copyVideo').remove();
  } else {
    // Add Video
    $(this).addClass('de-js-toggle');
    $('.de-js-view-images.hide').removeClass('hide');
    $('.de-js-watch-video').addClass('hide');
    // Clone first video, remove id, add classes for styling, and change height to appear 'square'
    const t = $('.de-js-firstVideo')
      .clone()
      .removeAttr('height')
      .attr('height', '50%')
      .removeAttr('id')
      .addClass('de-copyVideo')
      .addClass('de-js-copyVideo');
    $('.de-js-ProductPhoto').append(t);
  }
}
