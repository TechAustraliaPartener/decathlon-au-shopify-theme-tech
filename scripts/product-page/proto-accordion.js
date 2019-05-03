import $ from 'jquery';

const accordion = $('.js-Accordion');
const accordionHeader = $('.js-Accordion-header');

// This Javascript requires attention and refactoring by a developer before it
// should be considered ready for production

accordionHeader.on('click', function() {
  console.log('click');
  console.log($(this));
  $(this)
    .parents(accordion)
    .toggleClass('is-open');
});
