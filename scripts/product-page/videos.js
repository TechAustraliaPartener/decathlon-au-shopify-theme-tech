/* global videojs */

import $ from 'jquery';

const $posterImages = $('.js-de-slick--videos .vjs-poster');
const $videoCarousel = $('.js-de-slick--videos');
const $thumbnailCarousel = $('.js-de-slick--videos-thumbnails');
const $toggleButton = $('.js-de-watch-video-button');
const $viewImagesCTA = $('.js-de-view-images');
const $watchVideoCTA = $('.js-de-watch-video');
const $copyVideo = $('.js-de-copyVideo');

// Load poster images into DOM for slick slider navigation
$(window).on('load', function() {
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

  // Pause video on current slide before slide change
  $videoCarousel.on('beforeChange', function(
    event,
    slick,
    currentSlide,
    nextSlide
  ) {
    if (currentSlide !== nextSlide) {
      // Pause video (currentSlide+1 to skip over square video, which is first element in players[])
      videojs(players[currentSlide + 1].id()).pause();
    }
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
  const firstVideoPlayer = videojs(players[0].id());  
  if ($(this).hasClass('js-de-toggle')) {
    // Remove Video, switch to Images
    $(this).removeClass('js-de-toggle');
    $watchVideoCTA.removeClass('hide');
    $viewImagesCTA.addClass('hide');
    $copyVideo.addClass('hide');
    // Pause Video
    firstVideoPlayer.pause();
  } else {
    // Add Video
    $(this).addClass('js-de-toggle');
    $viewImagesCTA.removeClass('hide');
    $watchVideoCTA.addClass('hide');
    $copyVideo.removeClass('hide');
    // Play Video
    firstVideoPlayer.play();
  }
}

// Attach click event to 'Watch Videos' button to toggle between video and image
$toggleButton.click(toggleWatchVideo);

// Create array for player IDs
const players = [];
// Video Player Keys
const videoPlayerKeys = Object.keys(videojs.players);

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
 * Handle all players' play event
 * 
 * @param {object} e The handler event object
 */
function onPlay(e) {
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
}
