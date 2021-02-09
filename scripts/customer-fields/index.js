import Cookies from 'js-cookie';
import $ from 'jquery';

$(document).ready(function () {

  $('#cf_accept_terms').on('change', function () {
    if ($('#cf_accept_terms').is(':checked')) {
      $('#cf_accept_terms').prop("checked", true);
      $('#cf_accept_terms').val('true')
    } else {
      $('#cf_accept_terms').prop("checked", false);
      $('#cf_accept_terms').val('')
    }
  })

  function getCookie(name) {
    var cookieArr = document.cookie.split(";");
    for (var i = 0; i < cookieArr.length; i++) {
      var cookiePair = cookieArr[i].split("=");

      if (name == cookiePair[0].trim()) {
        return decodeURIComponent(cookiePair[1]);
      }
    }
  }

  $('#settingAccountSpiner').show();

  if (getCookie('is_from_registration')) {
    $('.registration-confirm-message').show();
    document.cookie = "is_from_registration=; max-age=0";
  }

  $('input, select').on('blur', function () {
    $(this).removeClass('error');
  });

  $('#editDetails').click(function (e) {
    e.preventDefault();
    $('#detailsDisplay').fadeOut(200, function () {
      $('#accountEdit').fadeIn();
    });
  });

  $('.show_edit_form').click(function (e) {
    e.preventDefault();
    $('#editDetails').click();
  });

  $('#updateMarketing').click(function (e) {
    e.preventDefault();
    $('[data-marketing-hide]').hide();
    $('[data-marketing-show]').show();
    $('#detailsDisplay').fadeOut(200, function () {
      $('#accountEdit').fadeIn();
    });
  });

  $(document).on(
    'click',
    '#cancelEditAccount',
    function (e) {
      e.preventDefault();
      $('#accountEdit').fadeOut(200, function () {
        $('[data-marketing-hide]').show();
        $('[data-marketing-show]').hide();
        $('#detailsDisplay').fadeIn();
      });
    }
  );

  $(document).on(
    'change',
    '#cf_accept_marketing',
    function (e) {
      if ($('#cf_accept_marketing').is(':checked')) {
        $('#cf_accept_marketing').prop("checked", true);
        $('#cf_accept_marketing').val('true')
      } else {
        $('#cf_accept_marketing').prop("checked", false);
        $('#cf_accept_marketing').val('')
      }
    }
  );

  document.addEventListener('cf:customer_saved', function (event) {
    setTimeout(function () {
      window.location.reload();
    }, 2000)
  });

  var checkbox_accept_marketing = setInterval(function () {
    if ($('[data-cf-loaded]').length) {
      $('#settingAccountSpiner').hide();
      if ($('#cf_accept_marketing').attr('checked')) {
        $('#cf_accept_marketing').prop("checked", true);
        $('#cf_accept_marketing').val('true');
        clearInterval(checkbox_accept_marketing);
      }
    }
  }, 100);

  let hasError = false,
    errorMessage = [],
    $accept_terms = $('input[name="customer[accepts_terms_conditions]"]');

  $('#cf_phone_number').on('input', function () {
    this.value = parseInt(this.value.replace(/[^0-9]/g, ''), 10) || '';
  });

  $('input[name="customer[postcode]"]').on('input', function () {
    this.value = parseInt(this.value.replace(/[^0-9]/g, ''), 10) || '';
  });

  function validate() {
    errorMessage = [];
    $('#cf_form_custom .required').each(function () {
      if (!$(this).val() || $(this).val() === '') {
        errorMessage.push('error: ' + $(this).attr("name"));
        $(this).addClass('error');
      } else {
        $(this).removeClass('error');
      }
    })

    if (!$('#cf_accept_terms').is(':checked')) {
      $('#cf_accept_terms').addClass('error');
      errorMessage.push('error');
    } else {
      $('#cf_accept_terms').removeClass('error')
    }

    hasError = errorMessage.length ? true : false;
  }

  function validateEmail(mail) {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
      return true
    }
    //alert("You have entered an invalid email address!")
    return false
  }

  $('.btn-submit-cf').on('click', function (e) {

    $('#cf_phone_number_hidden').val('+61' + $('#cf_phone_number').val())

    const { customerEmail } = window.vars;

    if ($('#accountInfo').length) {
      document.cookie = "is_from_registration=1; max-age=" + 60 * 5;
    }

    validate();

    if (!hasError) {

      $('#accountEditSpiner').show();

      $('html, body').animate({
        scrollTop: 0
      }, 100);
      return true;
    }

    return false;
  })

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

  let address_input = document.getElementById('google_address');
  let options = {
    types: ['address'],
    componentRestrictions: { country: 'au' }
  };
  let autocomplete = new google.maps.places.Autocomplete(address_input, options);
  autocomplete.addListener('place_changed', fillAddress);
  function fillAddress() {
    let place = autocomplete.getPlace();
    let streetNumber,
      streetName,
      suburb,
      city,
      regionName,
      regionCode,
      postalCode;
    place.address_components.forEach((item) => {
      if (item.types.includes('street_number')) {
        streetNumber = item.long_name;
      }
      if (item.types.includes('route')) {
        streetName = item.long_name;
      }
      if (item.types.includes('locality')) {
        suburb = item.long_name;
      }
      if (item.types.includes('administrative_area_level_2')) {
        city = item.short_name;
      }
      if (item.types.includes('administrative_area_level_1')) {
        regionName = item.long_name;
        regionCode = item.short_name;
      }
      if (item.types.includes('postal_code')) {
        postalCode = item.long_name;
      }
    });
    $('input[name="customer[addresses][address1]"]').val(`${streetNumber} ${streetName}`);
    $('input[name="customer[addresses][city]"]').val(`${suburb}`);
    $('input[name="customer[postcode]"]').val(`${postalCode}`);
    $('select[name="customer[addresses][province]"]').val(regionName);
  }
})