import Cookies from 'js-cookie';
import $ from 'jquery';

$(document).ready(() => {
  $('#accountInfo input, #accountEdit input').on('change', function () {
    const $registerField = $(this);
    const $hiddenCustomerField = $(
      `#customer-fields input[name="${$registerField.attr('name')}"]`
    );
    if ($hiddenCustomerField.length > 0) {
      if ($registerField.attr('type') === 'checkbox') {
        $hiddenCustomerField.prop('checked', $registerField.prop('checked'));
      } else if ($registerField.attr('type') === 'select') {
        $hiddenCustomerField.val($registerField.val());
      } else {

        const prefix = $registerField.data('prefix');
        const val = prefix ? prefix + $registerField.val() : $registerField.val();

        $hiddenCustomerField.val(val);
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

  $('#accountInfo form').find('input, select').trigger('change');

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

  if ($('#accountEdit').length > 0) {
    $('.edit-form .birthday_wrap').hide()
  }

  $('input[name="customer[addresses][][phone]"]').on('input', function () {
    this.value = parseInt(this.value.replace(/[^0-9]/g, ''), 10) || '';
  });

  $('input[name="customer[postcode]"]').on('input', function () {
    this.value = parseInt(this.value.replace(/[^0-9]/g, ''), 10) || '';
  });

  $('[data-submit]').on('submit', function (e) {
    let error = false;
    const $email = $('input[name="customer[email]"]');

    const $first_name = $('.copy-create input[name="customer[first_name]"]');
    const $last_name = $('.copy-create input[name="customer[last_name]"]');
    const $gender = $('.copy-create select[name="customer[gender]"]');
    const $province = $('.copy-create select[name="customer[addresses][][province]"]');
    const $suburb = $('.copy-create input[name="customer[addresses][][city]"]');
    const $preferred_store = $('.copy-create select[name="customer[preferred_store]"]');
    const $birthday = $('.copy-create input[name="customer[birthday]"]');
    const $phone = $('.copy-create input[name="customer[addresses][][phone]"]');
    const $address1 = $('.copy-create input[name="customer[addresses][][address1]"]');
    const $post_code = $('.copy-create input[name="customer[postcode]"]');
    const $terms_conditions = $('.copy-create input[name="customer[accepts_terms_conditions]"]');
    const $accepts_marketing = $('.copy-create input[name="customer[accepts_marketing]"]');

    const $falseGenderSelect = $('.copy-create select[name="customer[gender]"]');
    const $falseStateSelect = $('.copy-create select[name="customer[addresses][][province]"]');
    e.preventDefault();


    if ($($(this).data('submit')).length > 0) {

      if (!$first_name.val()) {
        $first_name.addClass('error');
        error = true;
      } else {
        $first_name.removeClass('error');
      }

      if (!$last_name.val()) {
        $last_name.addClass('error');
        error = true;
      } else {
        $last_name.removeClass('error');
      }

      if ($falseGenderSelect.find('option:selected').prop('disabled')) {
        $falseGenderSelect.addClass('error');
        error = true;
      } else {
        $falseGenderSelect.removeClass('error');
      }

      if (!$birthday.val()) {
        $birthday.addClass('error');
        error = true;
      } else {
        $birthday.removeClass('error');
      }

      if (!$phone.val()) {
        $phone.addClass('error');
        error = true;
      } else {
        $phone.removeClass('error');
      }

      if (!$address1.val()) {
        $address1.addClass('error');
        error = true;
      } else {
        $address1.removeClass('error');
      }

      if (!$post_code.val()) {
        $post_code.addClass('error');
        error = true;
      } else {
        $post_code.removeClass('error');
      }

      if (!$preferred_store.val()) {
        $preferred_store.addClass('error');
        error = true;
      } else {
        $preferred_store.removeClass('error');
      }

      if ($falseStateSelect.find('option:selected').prop('disabled')) {
        $falseStateSelect.addClass('error');
        error = true;
      } else {
        $falseStateSelect.removeClass('error');
      }

      if (!$suburb.val()) {
        $suburb.addClass('error');
        error = true;
      } else {
        $suburb.removeClass('error');
      }

      if (!$terms_conditions.is(':checked')) {
        $terms_conditions.addClass('error')
        error = true;
      } else {
        $terms_conditions.removeClass('error')
      }

      if (!error) {
        const { customerEmail } = window.vars;

        if ($accepts_marketing.is(':checked')) {
          const inFiveMinutes = new Date(new Date().getTime() + 5 * 60 * 1000);
          Cookies.set('optedInAt', customerEmail, { expires: inFiveMinutes });
        }
        
        $email.val(customerEmail);

        $($(this).data('submit')).submit();
      }
    }
  });

  $('#editDetails').click(function (e) {
    e.preventDefault();
    $('#detailsDisplay').fadeOut(200, function () {
      $('#accountEdit').fadeIn();
    });
    $('#accountEdit form').find('input, select').trigger('change');
  });

  $('#updateMarketing').click(function (e) {
    e.preventDefault();
    $('[data-marketing-hide]').hide();
    $('#detailsDisplay').fadeOut(200, function () {
      $('#accountEdit').fadeIn();
    });
    $('#accountEdit form').find('input, select').trigger('change');
  });

  $('#cancelEditAccount').click(function (e) {
    e.preventDefault();
    $('#accountEdit').fadeOut(200, function () {
      $('[data-marketing-hide]').show();
      $('#detailsDisplay').fadeIn();
    });
    $('#accountInfo form').find('input, select').trigger('change');
  });

  $('.show_edit_form').click(function (e) {
    e.preventDefault();
    $('#editDetails').click();
  });

  $('input, select').on('blur', function() {
    $(this).removeClass('error');
  });

  const { showDetailsForm, customerEmail } = window.vars;
  const optedIn = Cookies.get('optedInAt') === customerEmail;
  if (showDetailsForm && !optedIn) {
    $('#accountInfo').addClass('in');
    $('.grid__item.fade').remove();
  } else {
    $('#accountInfo').remove();
    $('.grid__item').addClass('in');
  }
  
});
