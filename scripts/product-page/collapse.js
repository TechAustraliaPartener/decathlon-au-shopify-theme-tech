import $ from 'jquery';

/**
 * Attach listeners to open collapse elements
 */
const initCollapse = () => {
  $('[data-collapse]').on('click', function() {
    $(this).toggleClass('expanded');
    $(`.de-collapse#${$(this).data('collapse')}`).toggleClass('expanded');
  });
};

/**
 * Put all functions that need to run on product-page load here
 */
export const init = () => {
  initCollapse();
};
