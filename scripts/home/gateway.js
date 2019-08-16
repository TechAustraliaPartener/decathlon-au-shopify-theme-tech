import $ from 'jquery';

const allowedStates = {
  AL: 'Alabama',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  DC: 'District Of Columbia',
  FL: 'Florida',
  GA: 'Georgia',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming'
};

const countryURL = {
  AU: 'https://www.decathlon.com.au/',
  AT: 'https://www.decathlon.at/',
  BE: 'https://www.decathlon.be/',
  BR: 'http://www.decathlon.com.br/',
  BG: 'https://www.decathlon.bg/',
  KH: 'https://www.decathlon.com.kh/en/',
  CA: 'https://www.decathlon.ca/',
  CL: 'https://www.decathlon.cl/',
  CO: 'https://www.decathlon.com.co/',
  HR: 'https://www.decathlon.hr/',
  CZ: 'https://www.decathlon.cz/',
  CD: 'http://www.decathlon-rdc.com/',
  EG: 'https://www.decathlon.eg/',
  FR: 'https://www.decathlon.fr/',
  DE: 'https://www.decathlon.de/',
  GH: 'https://www.decathlon.com.gh/',
  CN: 'https://www.decathlon.com.cn/',
  HU: 'https://www.decathlon.hu/',
  IN: 'https://www.decathlon.in/',
  ID: 'https://www.decathlon.co.id/',
  IL: 'https://www.decathlon.co.il/',
  IT: 'https://www.decathlon.it/',
  CI: 'http://www.decathlon.ci/',
  KE: 'https://www.decathlon.co.ke/',
  LT: 'https://www.decathlon.lt/lt_en/',
  MY: 'https://www.decathlon.my/',
  MX: 'https://www.decathlon.com.mx/',
  MA: 'https://www.decathlon.ma/',
  NL: 'https://www.decathlon.nl/',
  PH: 'https://www.decathlon.ph/',
  PL: 'https://www.decathlon.pl/',
  PT: 'https://www.decathlon.pt/',
  RO: 'https://www.decathlon.ro/',
  RU: 'https://www.decathlon.ru/',
  SN: 'https://www.decathlon.sn/',
  SG: 'https://www.decathlon.sg/',
  SK: 'https://www.decathlon.sk/',
  SI: 'https://www.decathlon.si/',
  ZA: 'https://www.decathlon-sports.co.za/',
  KR: 'https://www.decathlon.co.kr/kr_ko/',
  ES: 'https://www.decathlon.es/',
  LK: 'http://decathlonsrilanka.com/',
  SE: 'https://www.decathlon.se/',
  CH: 'https://www.decathlon.ch/',
  TH: 'https://www.decathlon.co.th/',
  TN: 'https://www.decathlon.tn/',
  TR: 'https://www.decathlon.com.tr/',
  GB: 'https://www.decathlon.co.uk/',
  US: 'US'
};

$(document).ready(() => {
  const decathlon = window.decathlon;
  const DecathlonCustomer = window.DecathlonCustomer;
  const getLocaleSync = window.getLocaleSync;
  const isProductPage = window.isProductPage;

  function scrollToTop() {
    window.scrollTo(0, 0);
  }

  function preventEventDefault(e) {
    e.preventDefault();
  }

  function f() {
    decathlon.setData('seenGateway', new Date().getTime());
    $(window).off('scroll', scrollToTop);
    $('#gateway').off('touchmove', preventEventDefault);
    $('#gateway').fadeOut(750, () => {
      if (!decathlon.getData('seenBanner'))
        $('.popup .banner-content').fadeIn(750);
    });
    if (!$('body').hasClass('template-index'))
      $('#PageContainer').css({
        '-o-filter': 'none',
        '-moz-filter': 'none',
        '-webkit-filter': 'none',
        '-ms-filter': 'none',
        filter: 'none'
      });
  }

  function isMobileDevice() {
    return (
      typeof window.orientation !== 'undefined' ||
      navigator.userAgent.indexOf('IEMobile') !== -1
    );
  }

  function fromAllowedState(blueLikeNeon) {
    const loc = blueLikeNeon.getData('locale');
    if (loc) {
      return allowedStates[blueLikeNeon.getUserRegionCode()];
    }
    const syncResult = getLocaleSync($);
    if (syncResult.error) return true; // By default don't show overlay
    if (syncResult.data.region_code)
      return allowedStates[syncResult.data.region_code];
    return true; // By default don't show overlay
  }
  function getCountry(decathlon) {
    // Try to get country from cookie data
    const loc = decathlon.getData('locale');
    if (loc) {
      return [countryURL[loc.country_code], loc.country_name];
    }
    // Try to get country from geolocation API call
    const syncResult = getLocaleSync($);
    if (syncResult.error) return ''; // By default don't show overlay
    if (syncResult.data.country_code)
      // Return 2 element array with country URL and country name
      return [
        countryURL[syncResult.data.country_code],
        syncResult.data.country_name
      ];
    return ''; // By default don't show overlay
  }

  const country = getCountry(decathlon);

  if (!isMobileDevice() && !isProductPage() && $('#gateway').length > 0) {
    if (
      !fromAllowedState(decathlon) &&
      country[0] === 'US' &&
      !decathlon.getData('seenGateway')
    ) {
      if ($('body').hasClass('template-index'))
        $('#gateway').addClass('gateway--home');
      else
        $('#PageContainer').css({
          '-o-filter': 'blur(5px)',
          '-moz-filter': 'blur(5px)',
          '-webkit-filter': 'blur(5px)',
          '-ms-filter':
            '"progid:DXImageTransform.Microsoft.Blur(PixelRadius=\'5\')"',
          filter: 'blur(5px)'
        });

      $('#gateway').show();
      (() => {
        const gatewayRegion = decathlon.getUserRegion();
        if (gatewayRegion) $('#hello-state').text(`Hello ${gatewayRegion}!`);
        else $('#hello-state').text('Hello!');
        $(`#sel-state option:contains(${gatewayRegion})`).prop({
          selected: true
        });

        $('#sel-state').addClass('is-selected');
      })();
      $('#gateway #contact_form').css(
        'height',
        $('#gateway #contact_form').innerHeight()
      );
      if (!decathlon.getData('seenBanner')) $('.popup .banner-content').hide();
      $(window).on('scroll', scrollToTop);
      $('#gateway').on('touchmove', preventEventDefault);
      $('#gateway .close-popup-btn').on('click', f);
      $('#gateway .js-closePopup').on('click', e => {
        e.preventDefault();
        f();
      });
      $('#gateway form select').on('change', e => {
        $(e.currentTarget).addClass('is-selected');
      });
      $('#gateway form').submit(function(i) {
        i.preventDefault();
        const n = $(this);
        const a = [];
        const r = n.find('select');
        if (!(r.val() && r.val() !== '')) a.push('Please select a state');
        const s = /\S+@\S+\.\S+/;
        if (!s.test(n.find('#GatewayFormEmail').val()))
          a.push('Invalid email.');
        if (a.length > 0) {
          $('.gateway-inputWrap .errors').remove();
          $('.gateway-inputWrap').prepend(
            '<div class="errors" style="margin: 0 4px 1em 4px;"><ul class="no-bullets u-marginBottom0x"></ul></div>'
          );

          $(a).each((e, i) => {
            $('.gateway-inputWrap .errors ul').append(`<li>${i}</li>`);
          });
          return false;
        }

        const c = new DecathlonCustomer({
          customer: {
            email: $('#GatewayFormEmail').val(),
            accepts_marketing: true,
            addresses: [
              {
                province: r.val(),
                country: 'US'
              }
            ]
          }
        });

        c.createCustomer()
          .then(() => {
            $('#gateway .hide-on-success').hide();
            $('#gatewayFormError').remove();
            n.prepend(
              '<h4 class="form-success">Thank you for signing up!</h4>'
            );

            decathlon.setData('userSetRegion', n.find('select').val());
            setTimeout(f, 500);
            if (decathlon.getUserRegion() !== 'CA') {
              window.addToWishlist = true;
              $('.addToCart .addToCartText').text('Add to Wishlist');
              $('.addToCart').click(function(e) {
                e.preventDefault();
                $(this)
                  .parents('.timber-activeProduct')
                  .find('.wk-add-product')
                  .click();
                $(this).blur();
              });
            }
          })
          .catch(error => {
            $('#gatewayFormError').remove();
            n.prepend(
              `<p id="gatewayFormError" class="form-error" style="color:white;background:transparent;max-width:580px;margin:10px auto;">${error.message}</p>`
            );

            $('#gatewayFormError a').attr('target', '_blank');
          });
      });
      $('#gateway .easybreathCTA-link a').click(() => {
        decathlon.setData('seenGateway', new Date().getTime());
      });
    }

    if (country[0] !== 'US') {
      if ($('body').hasClass('template-index'))
        $('#gateway').addClass('gateway--home');
      else
        $('#PageContainer').css({
          '-o-filter': 'blur(5px)',
          '-moz-filter': 'blur(5px)',
          '-webkit-filter': 'blur(5px)',
          '-ms-filter':
            '"progid:DXImageTransform.Microsoft.Blur(PixelRadius=\'5\')"',
          filter: 'blur(5px)'
          // Show gateway splash screen
        });
      $('#gateway').show();
      (() => {
        // Add background image
        $('[data-gateway-background-image]').each(function() {
          $(this).css(
            'background-image',
            `url(${$(this).data('gatewayBackgroundImage')})`
          );
        });
        // Remove email signup form, add buttons
        $('#gateway form').remove();
        $('#gateway .banner-subtitle').text('You are visiting Decathlon USA.');

        $('#gateway .gateway-content').append(
          '<div><a class="btn btn--text js-closePopup hide-on-success" href="#PageContainer">Enter U.S. Site</a></div>'
        );

        if (country[1] && country[1] !== 'undefined') {
          $('#hello-state').text(`Hello ${country[1]}!`);
        } else {
          $('#hello-state').text('Hello!');
        }
        // If Country has website, show link to website
        if (country[0]) {
          $('#gateway .gateway-content').append(
            `<div><a class="btn btn--text" href="${country[0]}">Enter ${
              country[1]
            } Site</a></div>`
          );
        }
      })();
      $('#gateway #contact_form').css(
        'height',
        $('#gateway #contact_form').innerHeight()
      );
      if (!decathlon.getData('seenBanner')) $('.popup .banner-content').hide();
      $(window).on('scroll', scrollToTop);
      $('#gateway').on('touchmove', preventEventDefault);
      $('#gateway .close-popup-btn').on('click', f);
      $('#gateway .js-closePopup').on('click', e => {
        e.preventDefault();
        f();
      });
    }
  }
});
