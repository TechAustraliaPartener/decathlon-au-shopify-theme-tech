import $ from 'jquery';

$(document).ready(() => {
  $('#accountInfo input, #accountEdit input').on('change', function() {
    console.log($(this).val());
    const $registerField = $(this);
    const $hiddenCustomerField = $(
      `#customer-fields input[name="${$registerField.attr('name')}"]`
    );
    console.log(`${$registerField.attr('name')}`);
    console.log($hiddenCustomerField);
    if ($hiddenCustomerField.length > 0) {
      if ($registerField.attr('type') === 'checkbox') {
        $hiddenCustomerField.prop('checked', $registerField.prop('checked'));
      } else if ($registerField.attr('type') === 'select') {
        $hiddenCustomerField.val($registerField.val());
      } else {
        $hiddenCustomerField.val($registerField.val());
      }
    }
  });

  $('#accountInfo select, #accountEdit select').on('change', function() {
    const $registerField = $(this);
    const $hiddenCustomerField = $(
      `#customer-fields select[name="${$registerField.attr('name')}"]`
    );
    if ($hiddenCustomerField.length > 0) {
      $hiddenCustomerField.val($registerField.val());
    }
  });

  window.addSpace = function($input) {
    $input.val(`${$input.val()} `);
  };

  $('.general-popup .modal_close').on('click', function() {
    const $popup = $(this).parents('.general-popup');
    $popup.hide();
    if ($popup.attr('id') === 'welcomePopup') {
      location.reload();
    }
  });

  $('.general-popup .modal_background').on('click', function() {
    const $popup = $(this).parents('.general-popup');
    $popup.hide();
    if ($popup.attr('id') === 'welcomePopup') {
      location.reload();
    }
  });

  $('[data-open-popup]').on('click', function() {
    const $popup = $($(this).attr('href'));
    $popup.show();
  });

  $('[data-submit]').on('submit', function(e) {
    e.preventDefault();
    if ($($(this).data('submit')).length > 0) {
      $($(this).data('submit')).submit();
    }
  });

  $('#editDetails').click(function(e) {
    e.preventDefault();
    $('#detailsDisplay').fadeOut(200, function() {
      $('#accountEdit').fadeIn();
    });
  });

  $('#updateMarketing').click(function(e) {
    e.preventDefault();
    $('[data-marketing-hide]').hide();
    $('#detailsDisplay').fadeOut(200, function() {
      $('#accountEdit').fadeIn();
    });
  });

  $('#cancelEditAccount').click(function(e) {
    e.preventDefault();
    $('#accountEdit').fadeOut(200, function() {
      $('[data-marketing-hide]').show();
      $('#detailsDisplay').fadeIn();
    });
  });
});
