const $ = window.jQuery;

var $posterImages = $('.js-de-slick--videos .vjs-poster');
var $videoCarousel = $('.js-de-slick--videos');
var $thumbnailCarousel = $('.js-de-slick--videos-thumbnails');
var $toggleButton = $('.js-de-watch-video-button');
var $viewImagesCTA = $('.js-de-view-images');
var $watchVideoCTA = $('.js-de-watch-video');
var $copyVideo = $('.js-de-copyVideo');

// Load poster images into DOM for slick slider navigation
$(window).on('load', function () {
  $posterImages.each(function(index) {
    const count = index + 1;
    $(`.js-de-slick--videos-thumbnails .js-de-thumb-${count}`).attr(
      'src',
      $(this)
        .css('background-image')
        .replace(/^url\(['"](.+)['"]\)/, '$1')
    );
  });

    // Create carousel with videos
    $videoCarousel.slick({
        asNavFor: $thumbnailCarousel,
        arrows: false
    });

    // Create carousel with video thumbnails
    $thumbnailCarousel.slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        asNavFor: $videoCarousel,
        centerMode: true,
        focusOnSelect: true
    });
});

// Function to toggle between 'Watch Videos' and 'View Images'
function toggleWatchVideo() {
  if ($(this).hasClass('js-de-toggle')) {
    // Remove Video, switch to Images
    $(this).removeClass('js-de-toggle');
    $watchVideoCTA.removeClass('hide');
    $viewImagesCTA.addClass('hide');
    $copyVideo.addClass('hide');
    } else {
    // Add Video
    $(this).addClass('js-de-toggle');
    $viewImagesCTA.removeClass('hide');
    $watchVideoCTA.addClass('hide');
    $copyVideo.removeClass('hide');
    }
}

// Attach click event to 'Watch Videos' button to toggle between video and image
$toggleButton.click(toggleWatchVideo);

