import $ from 'jquery';
import { CSS_PREFIX, JS_PREFIX } from './constants';
import { $ColorSwatches } from './color-swatches';
import { hideProductFlags, showProductFlags } from './product-flags';
let videojs = window.videojs;
// 960 roughly equates to the media query variable $breakpoint-lg
const LARGE_BREAKPOINT = 960;

// When element is within viewport
const IS_INTERSECTING = `${CSS_PREFIX}is-intersecting`;

// Create array for player IDs
const players = [];

const $videoCarousel = $('.js-de-slick--videos');
const $thumbnailCarousel = $('.js-de-slick--videos-thumbnails');

// Load poster images into DOM for slick slider navigation
$(window).on('load', function() {
  const $posterImages = $('.js-de-slick--videos .vjs-poster');
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
    arrows: false,
    swipe: false
  });

  // Pause video on current slide before slide change
  $videoCarousel.on('beforeChange', function(
    event,
    slick,
    currentSlide,
    nextSlide
  ) {
    if (currentSlide !== nextSlide && videojs) {
      // Pause video (currentSlide+1 to skip over square video, which is first element in players[])
      videojs(players[currentSlide + 1].id()).pause();
    }
  });

  // Create carousel with video thumbnails
  $thumbnailCarousel.slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    asNavFor: $videoCarousel,
    focusOnSelect: true,
    swipeToSlide: true,
    touchThreshold: 30
  });
});

const initializeVideoJS = () => {
  videojs = window.videojs;

  const $toggleButton = $('.js-de-toggle-media');
  const $viewImagesCTA = $('.js-de-view-images');
  const $watchVideoCTA = $('.js-de-watch-video');
  const $copyVideo = $('.js-de-copyVideo');
  const $imageCount = $('.js-de-ProductGallery-count');

  const getFirstVideoPlayer = () =>
    players[0] && 'id' in players[0] ? videojs(players[0].id()) : null;

  const controlFirstVideoPlayer = action => {
    if (!/^play|pause$/.test(action)) return;
    const player = getFirstVideoPlayer();
    player && player[action]();
  };

  const pauseFirstVideoPlayer = () => controlFirstVideoPlayer('pause');

  const playFirstVideoPlayer = () => controlFirstVideoPlayer('play');

  const switchToImages = () => {
    // Remove Video, switch to Images
    $toggleButton.removeClass('js-de-toggle');
    $watchVideoCTA.removeClass('de-u-hidden');
    $viewImagesCTA.addClass('de-u-hidden');
    $copyVideo.addClass('de-u-hidden');
    showProductFlags();
    $imageCount.removeClass('de-u-hidden');
    // Pause Video
    pauseFirstVideoPlayer();
  };

  const switchToVideo = () => {
    // Add Video
    $toggleButton.addClass('js-de-toggle');
    hideProductFlags();
    $imageCount.addClass('de-u-hidden');
    $viewImagesCTA.removeClass('de-u-hidden');
    $watchVideoCTA.addClass('de-u-hidden');
    $copyVideo.removeClass('de-u-hidden');
    // Play Video
    playFirstVideoPlayer();
  };

  $ColorSwatches.on('ColorSwatches:select', switchToImages);

  // Attach click event to 'Watch Videos' button to toggle between video and image
  $toggleButton.click(function() {
    if ($toggleButton.hasClass('js-de-toggle')) {
      switchToImages();
    } else {
      switchToVideo();
    }
  });

  // Video Player Keys
  const videoPlayerKeys = Object.keys(videojs.players);

  /**
   * Handle all players' play event
   *
   * @param {object} e The handler event object
   */
  const onPlay = e => {
    // Determine which player the event is coming from
    const id = e.target.id;
    // Loop through the array of players
    for (let i = 0; i < players.length; i++) {
      // Get the player(s) that did not trigger the play event
      if (players[i].id() !== id) {
        // Pause the other player(s)
        videojs(players[i].id()).pause();
      }
    }
  };

  // +++  Determine the available player IDs +++//
  for (let x = 0; x < videoPlayerKeys.length; x++) {
    // Assign the player name to setPlayer
    const setPlayer = videoPlayerKeys[x];
    // Define the ready event for the player
    videojs(setPlayer).ready(function() {
      // Assign this player to a variable
      const myPlayer = this;
      // Assign and event listener for play event
      myPlayer.on('play', onPlay);
      // Push the player to the players array
      players.push(myPlayer);
    });
  }

  /**
   * Watch for window resize event (debounced), pause gallery video
   */
  let timeout = null;
  $(window).resize(() => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if ($(window).width() >= LARGE_BREAKPOINT) {
        // Pause Video
        pauseFirstVideoPlayer();
        showProductFlags();
      }
    }, 250);
  });

  /**
   * Determine when element is within viewport
   * Confirm IntersectionObserver is available
   */
  if (window.IntersectionObserver) {
    /**
     * Trigger function when a video player componenet is within viewport
     * @see IntersectionObserver https://css-tricks.com/a-few-functional-uses-for-intersection-observer-to-know-when-an-element-is-in-view/
     */
    const observerOptions = {
      rootMargin: `0px 0px -${$videoCarousel.height()}px 0px`
    };
    // Toggle class that shows or hides controller bar/play button
    const handleObserver = entries =>
      entries.forEach(entry =>
        entry.isIntersecting
          ? entry.target.classList.add(IS_INTERSECTING)
          : entry.target.classList.remove(IS_INTERSECTING)
      );
    // Create new Observer instance
    const observer = new IntersectionObserver(handleObserver, observerOptions);
    // Add a watcher to each video player component
    $videoCarousel.each((index, videoElement) =>
      observer.observe(videoElement)
    );
  }
};

if (videojs) {
  initializeVideoJS();
} else {
  // Test if video carousel exists
  const script = document.querySelector(`.${JS_PREFIX}brightcove-script`);
  if (script) {
    script.addEventListener('load', () => {
      if (window.videojs) {
        initializeVideoJS();
      }
    });
  }
}
