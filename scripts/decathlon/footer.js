import $ from 'jquery';

$(document).ready(() => {
  const DecathlonCustomer = window.DecathlonCustomer;
  class CustomDropdown {
    /** @param {JQuery} $elements */
    constructor($elements) {
      this.dd = $elements;
      this.placeholder = this.dd.children('p');
      this.opts = this.dd.find('ul > li');
      this.val = '';
      this.index = -1;
      this.initEvents();
    }

    initEvents() {
      const self = this;
      this.dd.on('click', function() {
        $(this).toggleClass('active');
        return false;
      });
      this.opts.on('click', function() {
        const element = $(this);
        element.siblings('input').prop('checked', true);
        element.addClass('active');
        element.siblings('li').removeClass('active');
        element
          .siblings('li')
          .children('input')
          .prop('checked', true);
        self.val = element.text();
        self.index = element.index();
        self.placeholder.text(self.val);
      });
    }

    getValue() {
      return this.val;
    }

    getIndex() {
      return this.index;
    }
  }

  $('.footerNewsletter-form, .blogNewsletter-form').submit(function(e) {
    e.preventDefault();
    const i = $(this);
    $('.newsLetterForm-response').remove();
    let n = true;
    let a = i.find('.state-dropdown-list .active input');
    if (a.length === 0) {
      a = i.find('select');
      if (a.length === 0) n = false;
    }
    if (n) {
      i.append('<input type="hidden" name="MMERGE1" />');
      i.find('[name="MMERGE1"]').val(a.val());
    } else i.find('.footerNewsletter-dropdown-wrap, select').css('border', '1px solid red');
    let r = true;
    const s = /\S+@\S+\.\S+/;
    if (!s.test(i.find('input[type="email"]').val())) {
      i.find('input[type="email"]').css('border', '1px solid red');
      r = false;
    }
    if (!n) {
      i.after(
        '<p class="newsLetterForm-response error">Please select a state.</p>'
      );
      return false;
    }

    if (!r) {
      i.after(
        '<p class="newsLetterForm-response error">Please enter a valid email address.</p>'
      );
      return false;
    }
    const c = new DecathlonCustomer({
      customer: {
        email: i
          .find('input[type="email"]')
          .val()
          .toLowerCase(),
        accepts_marketing: true,
        addresses: [
          {
            province: a.val(),
            country: 'US'
          }
        ]
      }
    });
    c.createCustomer()
      .then(() => {
        i.hide();
        i.after(
          '<p class="newsLetterForm-response success">Thank you for signing up!</p>'
        );
        if ($('body').hasClass('template-article')) {
          $('.blog-article-newsletter-form .hide-on-success').hide();
          $(
            '.blog-article-newsletter-form .blog-article-newsletter-success'
          ).css('display', 'block');
        }
      })
      .catch(error => {
        i.after(
          `<p class="newsLetterForm-response error">${error.message}</p>`
        );
      });
  });
  if ($('.blue-band').length > 0) {
    $('.blue-band').each(function() {
      $(this)
        .children()
        .children()
        .children('.grid__item')
        .eq(1)
        .addClass('active');
    });
    $('.blue-band-icon').click(function() {
      $(this)
        .parent()
        .parent()
        .addClass('active');
      $(this)
        .parent()
        .parent()
        .siblings()
        .removeClass('active');
    });
  }
  $('.blue-band-link').click(function(i) {
    if ($(window).width() >= 1e3 || i.target.nodeName === 'P')
      window.location.href = $(this).data('href');
  });

  // eslint-disable-next-line no-new
  new CustomDropdown($('.footerNewsletter-dropdown-wrap'));
  $(document).click(() => {
    $('.footerNewsletter-dropdown-wrap').removeClass('active');
  });
});
