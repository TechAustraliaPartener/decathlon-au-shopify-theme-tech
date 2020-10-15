import $ from 'jquery';

$(document).ready(() => {
  $('#accountInfo input, #accountEdit input').on('change', function () {
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

  $('#accountInfo select, #accountEdit select').on('change', function () {
    const $registerField = $(this);
    const $hiddenCustomerField = $(
      `#customer-fields select[name="${$registerField.attr('name')}"]`
    );
    if ($hiddenCustomerField.length > 0) {
      $hiddenCustomerField.val($registerField.val());
    }

    const $hiddenCustomerField2 = $(
      `#customer-fields input[name="${$registerField.attr('name')}"]`
    );
    if ($hiddenCustomerField2.length > 0) {
      $hiddenCustomerField2.val($registerField.val());
    }
  });

  window.addSpace = function ($input) {
    $input.val(`${$input.val()} `);
  };

  $('.general-popup .modal_close').on('click', function () {
    const $popup = $(this).parents('.general-popup');
    $popup.hide();
    if ($popup.attr('id') === 'welcomePopup') {
      location.reload();
    }
  });

  $('.general-popup .modal_background').on('click', function () {
    const $popup = $(this).parents('.general-popup');
    $popup.hide();
    if ($popup.attr('id') === 'welcomePopup') {
      location.reload();
    }
  });

  $('[data-open-popup]').on('click', function () {
    const $popup = $($(this).attr('href'));
    $popup.show();
  });

  $('[data-submit]').on('submit', function (e) {
    console.log('submit form');
    let error = false;
    const $first_name = $('input[name="customer[first_name]"]');
    const $last_name = $('input[name="customer[last_name]"]');
    const $gender = $('select[name="customer[gender]"]');
    const $province = $('select[name="customer[addresses][][province]"]');
    const $preferred_store = $('select[name="customer[preferred_store]"]');
    const $birthday = $('input[name="customer[birthday]"]');
    const $phone = $('input[name="customer[addresses][][phone]"]');
    const $address1 = $('input[name="customer[addresses][][address1]"]');
    const $post_code = $('input[name="customer[postcode]"]');

    e.preventDefault();
    if ($($(this).data('submit')).length > 0) {

      if ($first_name.val() == '') {
        $first_name.addClass('error');
        error = true;
      } else {
        $first_name.removeClass('error');
      }

      if ($address1.val() == '') {
        $address1.addClass('error');
        error = true;
      } else {
        $address1.removeClass('error');
      }

      if ($post_code.val() == '') {
        $post_code.addClass('error');
        error = true;
      } else {
        $post_code.removeClass('error');
      }

      if ($phone.val() == '') {
        $phone.addClass('error');
        error = true;
      } else {
        $phone.removeClass('error');
      }

      // $phone.keyup(function () {
      //   this.value = this.value.replace(/[^0-9\.]/g, '');
      // });

      // $('input[name="customer[addresses][][phone]"]').on('keypress', function (e) {
      //   console.log('numbers only');
      //   if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
      //     console.log('numbers only please');
      //     return false;
      //   }
      // });

      if ($last_name.val() == '') {
        $last_name.addClass('error');
        error = true;
      } else {
        $last_name.removeClass('error');
      }

      if ($gender.val() == '') {
        $gender.addClass('error');
        error = true;
      } else {
        $gender.removeClass('error');
      }

      if ($birthday.val() == '') {
        $birthday.addClass('error');
        error = true;
      } else {
        $birthday.removeClass('error');
      }

      if ($preferred_store.val() == '') {
        $preferred_store.addClass('error');
        error = true;
      } else {
        $preferred_store.removeClass('error');
      }

      if ($province.val() == '') {
        $province.addClass('error');
        error = true;
      }
      else {
        $province.removeClass('error');
      }

      if (!$('input[name="customer[accepts_terms_conditions]"]').is(':checked')) {
        $('input[name="customer[accepts_terms_conditions]"]').addClass('error')
        error = true;
      } else {
        $('input[name="customer[accepts_terms_conditions]"]').removeClass('error')
      }

      if (!error) {
        $($(this).data('submit')).submit();
      }
    }
  });

  $('#editDetails').click(function (e) {
    e.preventDefault();
    $('#detailsDisplay').fadeOut(200, function () {
      $('#accountEdit').fadeIn();
    });
  });

  $('#updateMarketing').click(function (e) {
    e.preventDefault();
    $('[data-marketing-hide]').hide();
    $('#detailsDisplay').fadeOut(200, function () {
      $('#accountEdit').fadeIn();
    });
  });

  $('#cancelEditAccount').click(function (e) {
    e.preventDefault();
    $('#accountEdit').fadeOut(200, function () {
      $('[data-marketing-hide]').show();
      $('#detailsDisplay').fadeIn();
    });
  });

  $('.show_edit_form').click(function (e) {
    e.preventDefault();
    $('#editDetails').click();
  });
});
