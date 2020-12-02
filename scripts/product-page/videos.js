// @ts-check

import $ from 'jquery';
import { CSS_PREFIX, JS_PREFIX } from './constants';
import { $swatches } from './color-swatches';
import { hideProductFlags, showProductFlags } from './product-flags';
import { DEBUG } from '../shared/config';
let videojs = window.videojs;
// 960 roughly equates to the media query variable $breakpoint-lg
const LARGE_BREAKPOINT = 960;

// When element is within viewport
const IS_INTERSECTING = `${CSS_PREFIX}is-intersecting`;

// Create array for player IDs
const players = [];

// Create array for error video IDs
const errorVideoIds = [];

const $videoCarousel = $('.js-de-slick--videos');
const $thumbnailCarousel = $('.js-de-slick--videos-thumbnails');

/** -- Helper functions -- */

/**
 * Handle all players' play event
 *
 * @param {Event} event The handler event object
 */
const onPlay = event => {
  // Determine which player the event is coming from
  const { id } = /** @type {HTMLElement} */ (event.target);
  // Loop through the array of players
  for (let i = 0; i < players.length; i++) {
    // Get the player(s) that did not trigger the play event
    if (players[i].id() !== id) {
      // Pause the other player(s)
      videojs(players[i].id()).pause();
    }
  }
};

/**
 * Track all players' errors or error events
 *
 * @param {string} videoId - The ID of the video in error
 */
const trackVideosWithErrors = videoId => {
  // Build the product URL
  const productURL = window.location.host + window.location.pathname;
  // Send an event to Google Analytics, only one per broken video
  if (!errorVideoIds.includes(videoId)) {
    window.dataLayer.push({
      event: 'video-is-broken',
      videoId,
      productURL
    });
    if (DEBUG)
      console.debug('🎬 Video error added to dataLayer', window.dataLayer);
    errorVideoIds.push(videoId);
  }
};

/**
 * Return a trimmed version of the video player's `referenceId`
 * @param {string} referenceId
 */
const trimVideoReferenceId = referenceId =>
  referenceId.replace(/ref:|_1/g, '').trim();

/**
 * Get a video id from a video error event
 *
 * @param {HTMLElement} videoEl - A video error event
 * @returns {string} - The video's id
 */
const getIDFromVideoElement = videoEl =>
  trimVideoReferenceId(videoEl.dataset.videoId);

/**
 * Get the first video player
 *
 * @returns {Object|null}
 */
const getFirstVideoPlayer = () =>
  players[0] && 'id' in players[0] ? videojs(players[0].id()) : null;

/**
 * Control the first video player
 *
 * @param {'play' | 'pause'} action
 */
const controlFirstVideoPlayer = action => {
  const player = getFirstVideoPlayer();
  player && player[action]();
};

/**
 * Play the first video player
 */
const pauseFirstVideoPlayer = () => controlFirstVideoPlayer('pause');

/**
 * Pause the first video player
 */
const playFirstVideoPlayer = () => controlFirstVideoPlayer('play');

/** -- Page load setup -- */

// Load poster images into DOM for slick slider navigation
$(window).on('load', function() {
  const $posterImages = $('.js-de-slick--videos .vjs-poster');
  $posterImages.each(function(index) {
    const count = index + 1;
    $(
      `.js-de-slick--videos-thumbnails .js-de-AdditionalVideos-thumb-${count}`
    ).attr(
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

/** -- Video Initialization -- */

const initializeVideoJS = () => {
  videojs = window.videojs;

  const $toggleButton = $('.js-de-toggle-media');
  const $viewImagesCTA = $('.js-de-view-images');
  const $watchVideoCTA = $('.js-de-watch-video');
  const $galleryVideo = $('.js-de-galleryVideo');
  const $imageCount = $('.js-de-ProductGallery-count');

  const switchToImages = () => {
    // Remove Video, switch to Images
    $toggleButton.removeClass('js-de-toggle');
    $watchVideoCTA.removeClass('de-u-hidden');
    $viewImagesCTA.addClass('de-u-hidden');
    $galleryVideo.addClass('de-u-hidden');
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
    $galleryVideo.removeClass('de-u-hidden');
    // Play Video
    playFirstVideoPlayer();
  };

  $swatches.on('ColorSwatches:select', switchToImages);

  // Attach click event to 'Watch Videos' button to toggle between video and image
  $toggleButton.click(function() {
    if ($toggleButton.hasClass('js-de-toggle')) {
      switchToImages();
    } else {
      switchToVideo();
    }
  });

  // Video Player Keys
  const videoPlayerKeys = Object.keys(videojs.getPlayers());

  // +++  Determine the available player IDs +++//
  for (let x = 0; x < videoPlayerKeys.length; x++) {
    // Assign the player name to setPlayer
    const setPlayer = videoPlayerKeys[x];
    // Define the ready event for the player
    videojs(setPlayer).ready(function() {
      // Assign this player to a variable
      const myPlayer = this;
      const videoLoadError =
        myPlayer.error && myPlayer.error() && myPlayer.error().code;
      const referenceId =
        myPlayer.mediainfo &&
        myPlayer.mediainfo.referenceId &&
        trimVideoReferenceId(myPlayer.mediainfo.referenceId);
      // Assign and event listener for play event
      myPlayer.on('play', onPlay);
      // Push the player to the players array
      players.push(myPlayer);
      // Handle videos that don't work on page load
      if (videoLoadError && referenceId) {
        trackVideosWithErrors(referenceId);
      }
      // Assign an event listener for a video player error event
      myPlayer.on('error', event => {
        trackVideosWithErrors(
          getIDFromVideoElement(/** @type {HTMLElement} */ (event.target))
        );
      });
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
   * Confirm IntersectionObserver is available on the global object
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
