import $ from 'jquery';
import { decode } from 'qss';
/* eslint-disable complexity, @cloudfour/no-param-reassign, no-redeclare, eqeqeq, no-negated-condition, radix, block-scoped-var, no-var, no-alert, no-new, @cloudfour/unicorn/explicit-length-check, max-params, no-new-func */
/* global Handlebars, Cookies, jQuery, BlueLikeNeon, s3, DecathlonCustomer */
function handlebarsSafeCompile(string) {
  if (string) {
    return Handlebars.compile(string);
  }
  return data => {
    /**
     * @TODO - remove logs for production
     * This should be used to see what's trying to compile against elements
     * that have been removed from the baseline template
     */
    console.debug(
      'Data being passed to nonexistent string for Handlebars',
      data
    );
    return '';
  };
}

const loadImages = () => {
  $('img[data-src]').each((i, el) => {
    $(el).attr('src', $(el).attr('data-src'));
  });
  $('[data-background-image]').each((i, el) => {
    $(el).css('background-image', `url(${$(el).data('backgroundImage')})`);
  });
};

const slugify = e =>
  e
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * @see https://gist.github.com/jed/982883
 */
const uuid = t =>
  t
    ? (t ^ ((16 * Math.random()) >> (t / 4))).toString(16)
    : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);

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

function isProductPage() {
  const thisUrl = window.location.href;
  const pages = thisUrl.split('/');
  for (const i in pages) {
    if (
      pages[i] === 'collections' ||
      pages[i] === 'products' ||
      pages[i] === 'repls'
    )
      return true;
  }
  return false;
}

function getLocaleSync($) {
  // Alan
  let data = {};
  let error = null;
  $.ajax({
    dataType: 'json',
    url:
      'https://api.ipstack.com/check?access_key=23cb2745b5ee35580d6f00373f14f868&legacy=1',
    async: false,
    success(result) {
      data = result;
    },
    error(err) {
      console.log('err with getLocaleSync', err);
      error = err;
    }
  });
  return { error, data };
}

($ => {
  const t = {
    url: false,
    callback: false,
    target: false,
    duration: 120,
    on: 'mouseover',
    touch: true,
    onZoomIn: false,
    onZoomOut: false,
    magnify: 1
  };
  $.zoom = (t, i, n, o) => {
    let a;
    let r;
    let s;
    let c;
    let l;
    let d;
    let u;
    const p = $(t);
    const f = p.css('position');
    const h = $(i);
    t.style.position = /(absolute|fixed)/.test(f) ? f : 'relative';
    t.style.overflow = 'hidden';
    n.style.width = '';
    n.style.height = '';
    $(n)
      .addClass('zoomImg')
      .css({
        position: 'absolute',
        top: 0,
        left: 0,
        opacity: 0,
        width: n.width * o,
        height: n.height * o,
        border: 'none',
        maxWidth: 'none',
        maxHeight: 'none'
      })
      .appendTo(t);
    return {
      init() {
        r = p.outerWidth();
        a = p.outerHeight();
        if (i === t) {
          c = r;
          s = a;
        } else {
          c = h.outerWidth();
          s = h.outerHeight();
        }
        l = (n.width - r) / c;
        d = (n.height - a) / s;
        u = h.offset();
      },
      move(e) {
        let t = e.pageX - u.left;
        let i = e.pageY - u.top;
        i = Math.max(Math.min(i, s), 0);
        t = Math.max(Math.min(t, c), 0);
        n.style.left = `${t * -l}px`;
        n.style.top = `${i * -d}px`;
      }
    };
  };
  $.fn.zoom = function(i) {
    return this.each(function() {
      const n = $.extend({}, t, i || {});
      const o = (n.target && $(n.target)[0]) || this;
      const a = this;
      const r = $(a);
      const s = document.createElement('img');
      const c = $(s);
      const l = 'mousemove.zoom';
      if (!n.url) {
        const p = a.querySelector('img');
        if (p) n.url = p.getAttribute('data-src') || p.currentSrc || p.src;
        if (!n.url) return;
      }
      r.one(
        'zoom.destroy',
        ((e, t) => {
          r.off('.zoom');
          o.style.position = e;
          o.style.overflow = t;
          s.addEventListener('load', null);
          c.remove();
        }).bind(this, o.style.position, o.style.overflow)
      );

      s.addEventListener('load', () => {
        function t(t) {
          p.init();
          p.move(t);
          c.stop().fadeTo(
            $.support.opacity ? n.duration : 0,
            1,
            Boolean($.isFunction(n.onZoomIn)) && n.onZoomIn.call(s)
          );
        }

        function i() {
          c.stop().fadeTo(
            n.duration,
            0,
            Boolean($.isFunction(n.onZoomOut)) && n.onZoomOut.call(s)
          );
        }
        var p = $.zoom(o, a, s, n.magnify);
        if (n.on === 'grab')
          r.on('mousedown.zoom', n => {
            if (n.which === 1) {
              $(document).one('mouseup.zoom', () => {
                i();
                $(document).off(l, p.move);
              });
              t(n);
              $(document).on(l, p.move);
              n.preventDefault();
            }
          });
        else if (n.on === 'click')
          r.on('click.zoom', () => {
            // Return d ? void 0 : (d = true, t(n), e(document).on(l, p.move), e(document).one("click.zoom", function() {
            //     i(), d = false, e(document).off(l, p.move)
            // }), false)
          });
        else if (n.on === 'toggle')
          r.on('click.zoom', () => {
            // D ? i() : t(e), d = !d
          });
        else if (n.on === 'mouseover') {
          p.init();
          r.on('mouseenter.zoom', t)
            .on('mouseleave.zoom', i)
            .on(l, p.move);
        }
        if (n.touch)
          r.on('touchstart.zoom', () => {
            // E.preventDefault(), u ? (u = false, i()) : (u = true, t(e.originalEvent.touches[0] || e.originalEvent.changedTouches[0]))
          })
            .on('touchmove.zoom', () => {
              // E.preventDefault(), p.move(e.originalEvent.touches[0] || e.originalEvent.changedTouches[0])
            })
            .on('touchend.zoom', () => {
              // E.preventDefault(), u && (u = false, i())
            });
        if ($.isFunction(n.callback)) n.callback.call(s);
      });
      s.src = n.url;
    });
  };
  $.fn.zoom.defaults = t;
})(window.jQuery);
((global, Cookies, $) => {
  class ImageGroups {
    constructor(groupOn, productJSON) {
      this.groupOn_ = groupOn || 'Color';
      this.optionKey_ = null;
      this.groups_ = [];
      this.currentImage_ = '';
      this.productJSON = productJSON || global.productJSON;
      this.findOptionNumber_();
      this.initGroups_();
      this.buildGroups_();
    }

    findOptionNumber_() {
      const e = this;
      for (let i = 0; i < e.productJSON.options.length; i++)
        if (e.productJSON.options[i] === e.groupOn_)
          e.optionKey_ = `option${i + 1}`;
      return e;
    }

    initGroups_() {
      const e = this;
      for (let i = 0; i < e.productJSON.variants.length; i++) {
        const t = e.productJSON.variants[i];
        if (e.currentImage_ !== t.featured_image.src) {
          e.currentImage_ = t.featured_image.src;
          e.groups_.push({
            color: t[e.optionKey_],
            images: [e.currentImage_]
          });
        }
      }
      return e;
    }

    buildGroups_() {
      const e = this;
      let t = 0;
      for (let i = 0; i < e.productJSON.images.length; i++) {
        const n = e.productJSON.images[i];
        for (let j = 0; j < e.groups_.length; j++)
          if (n === e.groups_[j].images[0].replace(/^https:/, '')) t = j;
        if (n !== e.groups_[t].images[0].replace(/^https:/, ''))
          e.groups_[t].images.push(n);
      }
      return e;
    }

    getGroups() {
      return this.groups_;
    }
  }

  class BlueLikeNeon {
    constructor(cookieName) {
      this.cookieName_ = cookieName || 'bln';
      this.cookieData_ = Cookies.getJSON(this.cookieName_) || {};
      const i = new Date().getTime();
      if (!this.cookieData_.createdAt) {
        this.setData('createdAt', i);
        this.setData('id', uuid());
      }
      this.setData('updatedAt', i);
    }

    // Only used within this file
    getLocale() {
      return new Promise((resolve, reject) => {
        if (this.cookieData_.locale) resolve(this.cookieData_.locale);
        else {
          $.getJSON(
            'https://api.ipstack.com/check?access_key=23cb2745b5ee35580d6f00373f14f868&legacy=1'
          )
            .then(i => {
              Cookies.set(this.cookieName_, {
                locale: i
              });

              this.cookieData_ = Cookies.getJSON(this.cookieName_);
              return resolve(this.cookieData_.locale);
            })
            .fail(error => {
              console.log('error retrieving geoip.');
              return reject(error);
            });
        }
      });
    }

    // Only used within this file
    getUserRegionCode() {
      let rc = null;
      if (this.getData('userSetRegion') === 'California') rc = 'CA';
      return rc || this.getData('locale').region_code;
    }

    // Only used within this file
    getUserRegion() {
      let thisRegion = this.getData('userSetRegion');
      if (thisRegion) return thisRegion;
      thisRegion = this.getData('locale');
      if (thisRegion) return thisRegion.region_name;
      const thisRegionResult = getLocaleSync($);
      if (thisRegionResult.error) return;
      return thisRegionResult.data.region_name;
    }

    // Only called within this file
    // Legacy product page only?
    optionToSwatch() {
      const wrapperEl = $('.selector-wrapper');

      wrapperEl.find('label').each((i, labelEl) => {
        const text = $(labelEl).text();
        $(labelEl).data('title', text);
        $(labelEl).text(text);
        $(labelEl)
          .parent()
          .addClass(['selector-wrapper', slugify(text)].join('--'));
      });
      wrapperEl.each(function() {
        const options = [];
        // I don't think that `.single-option-selector` ever exists. Can the related logic be removed?
        const n = $(this).find('.single-option-selector');
        const labelName =
          $(this)
            .find('label')
            .data('title') || uuid().replace(/-/g, '');
        n.find('option').each((i, optionEl) => {
          options.push(
            `<a href="#" class="option option--${slugify(labelName)}-${slugify(
              $(optionEl).val()
            )}" data-value="${$(optionEl)
              .val()
              .replace('"', '&quot;')}">${$(optionEl).text()}</a>`
          );
        });
        n.hide();
        $(this).append(
          `<div class="options" data-option="${n.data(
            'option'
          )}">${options.join('')}</div>`
        );
        if (labelName != 'Size') {
          $(this)
            .not('.selector-wrapper--size')
            .find('.options .option')
            .not('.disabled')
            .first()
            .addClass('option--active');
        }
        $(this)
          .find('.options .option')
          .on('click', function(e) {
            e.preventDefault();
            $(this)
              .parent()
              .find('.option')
              .removeClass('option--active');
            $(this).addClass('option--active');
            $(this)
              .parents('.selector-wrapper')
              .find('label')
              .addClass('is-selected')
              .text($(e.currentTarget).data('value'));
            n.val($(e.currentTarget).data('value')).change();
          });
        if ($(this).find('.options .option').length == 1) {
          $(this)
            .find('.options .option')
            .first()
            .click();
        }
      });
      // Why does this return a promise?
      return Promise.resolve();
    }

    // Only called within this file
    fullscreen(opts) {
      const containerSelector = opts.container || '.js-fullscreen';
      const wrapperSelector = opts.wrapper || '.wrapper';
      const offsetHeight = opts.offsetHeight || 0;
      const windowHeight = $(global).height();

      $(containerSelector).each(function() {
        const containerHeight = $(this)
          .find(wrapperSelector)
          .height();
        const minPadding = parseInt(
          $(containerSelector)
            .css('padding-top')
            .replace('px', '')
        );

        const normalizedPadding =
          (windowHeight - offsetHeight - containerHeight) / 2;
        if (!(minPadding > normalizedPadding))
          $(containerSelector).css({
            'padding-top': normalizedPadding,
            'padding-bottom': normalizedPadding
          });
      });
      return this;
    }

    // Only called within this file
    recentlyViewed(e) {
      const recentProducts = this.cookieData_.recentlyViewed || [];
      if (!recentProducts.length) $('body').addClass('is-emptyRecentlyViewed');
      $(recentProducts).each((index, product) => {
        if (e.url === product.url)
          recentProducts.splice(recentProducts[index], 1);
      });
      recentProducts.unshift(e);
      if (recentProducts.length > 4) recentProducts.length = 4;
      Cookies.set(
        this.cookieName_,
        $.extend(this.cookieData_, {
          recentlyViewed: recentProducts
        })
      );
    }

    // Only called within this file
    setData(e, n) {
      const a = {};

      a[e] = n;
      Cookies.set(this.cookieName_, $.extend(this.cookieData_, a));
      return this;
    }

    // Only called within this file
    getData(e) {
      return this.cookieData_[e];
    }

    // Only called within this file
    // Used for get going packs, legacy product page, our story page
    pinToHeader(t) {
      const n = this;
      return setTimeout(_pinToHeader, 10);
      function _pinToHeader() {
        const o = $(t.selector);
        let a =
          $(t.selector).innerHeight() +
          $('.js-de-PageWrap-header').innerHeight() +
          5;
        const r = t.selector.substr(1);
        if (!o.length) return n;
        let s = [];
        o.find('.js-anchorLink').each(function(index, anchorEl) {
          s.push({
            top: $($(anchorEl).attr('href')).offset().top - a,
            index
          });
        });
        let c = t.offset();
        let l = o.offset().top - c;
        const d = () => {
          c = t.offset();
          l = o.offset().top - c;
          a = o.innerHeight() + $('.js-de-PageWrap-header').innerHeight() + 5;
          s = [];
          o.find('.js-anchorLink').each(function(index, anchorEl) {
            s.push({
              top: $($(anchorEl).attr('href')).offset().top - a,
              index
            });
          });
        };
        $('#PageContainer').resize(d);
        const u = () => {
          if (isProductPage()) {
            // If (i(e).scrollTop() < (l - i('.js-de-PageWrap-header').css('height').split('px')[0])) return void(1 === i(t.selector + "--cloned").length && (o.detach(), o.removeClass(r + "--cloned is-fixed"), o.css({
            if ($(global).scrollTop() < l) {
              if ($(`${t.selector}--cloned`).length === 1) {
                o.detach();
                o.removeClass(`${r}--cloned is-fixed`);
                o.css({
                  top: ''
                });

                $(`${t.selector}--placeholder`).replaceWith(o);
                if (t.unpinCallback) t.unpinCallback(o);
              }
              return;
            }
          } else if ($(global).scrollTop() < l) {
            if ($(`${t.selector}--cloned`).length === 1) {
              o.detach();
              o.removeClass(`${r}--cloned is-fixed`);
              o.css({ top: '' });
              $(`${t.selector}--placeholder`).replaceWith(o);
              if (t.unpinCallback) t.unpinCallback(o);
            }
            return;
          }
          if ($(`${t.selector}--cloned`).length === 0) {
            o.after(
              `<div class="${o.attr(
                'class'
              )} ${r}--placeholder" style="height:${
                o[0].getBoundingClientRect().height
              }px"></div>`
            );

            o.addClass(`${r}--cloned is-fixed`).detach();
            $('body').append(o);
            o.css({
              top: c
            });
            if (t.pinCallback) t.pinCallback(o);
          }
          if (s.length) {
            for (
              var a = null, d = 0;
              d < s.length && $(global).scrollTop() > s[d].top;
              d++
            )
              a = o.find('.anchorList-link').eq(s[d].index);
            o.find('.anchorList-link')
              .removeClass('anchorList-link--active')
              .blur();
            if (a) a.addClass('anchorList-link--active');
          }
        };
        $(global).on('scroll', u);
        $('#PageContainer').resize(u);
        return n;
      }
    }

    imageGroups(groupOn, productJSON) {
      return new ImageGroups(groupOn, productJSON);
    }

    // Only called in this file
    anchorLinks(getHeaderHeight) {
      $('.js-anchorLink').on('click', function(event) {
        event.preventDefault();
        $('.js-navRelative').addClass('is-hidden');
        $(`#${event.currentTarget.href.split('#')[1]}`).removeClass(
          'is-hidden'
        );
        $(this)
          .parents('.anchorList')
          .find('.anchorList-link')
          .removeClass('anchorList-link--active');
        $(this).addClass('anchorList-link--active');
        $('html, body').scrollTop(
          $($(this).attr('href')).offset().top - getHeaderHeight() - 30
        );
      });
    }

    // Only called in this file
    getGoingPacks(e) {
      $('.js-getGoingPack').each((i, getGoingPackEl) => {
        const bannerHeight = $(getGoingPackEl)
          .find('.getGoingPack-banner')
          .outerHeight();
        const currentProductWrapper = $(getGoingPackEl).find(
          '.getGoingPack-currentProductWrapper'
        );
        const currentProductWrapperHeight = currentProductWrapper.height();
        currentProductWrapper.outerHeight();
        const productListHeight = $(getGoingPackEl)
          .find('.getGoingPack-productList')
          .outerHeight();
        const padding = e
          ? '0'
          : `${Math.floor(
              Math.max(
                0,
                (bannerHeight -
                  currentProductWrapperHeight -
                  productListHeight) /
                  2
              )
            )}px 0`;
        $(getGoingPackEl)
          .find('.getGoingPack-currentProductWrapper')
          .css({ padding });
      });
    }

    // Used in appmate wishlist most likely
    addPromo(e, i) {
      $('.promo-band').remove();
      $('body').append(
        `<div class="promo-band is-fixed ${i}"><div class="wrapper">${e}</div><div class="promo-band__close" onclick="this.parentNode.parentNode.removeChild(this.parentNode);"></div></div>`
      );
    }

    // Used in other files, Collections and search possibly?
    wishlistSwap(i = global.addToWishlist) {
      const o = $('body').hasClass('template-product');
      const a = o && $('body').hasClass('is-sellableProduct');
      if (i) {
        if (a) return;
        global.addToWishlist = true;
        $('main').addClass('hide-wkCartButtons');
        $('.addToCart .addToCartText, .js-addToWishlist .addToCartText').text(
          'Add to Wishlist'
        );

        $('.addToCart, .js-addToWishlist').click(function(e) {
          e.preventDefault();
          if ($('body').hasClass('template-product'))
            $('.timber-activeProduct')
              .find('.wk-button-product')
              .click();
          else {
            const i = $(e.currentTarget)
              .parents('.timber-activeProduct')
              .find('.wk-button-product');
            i.trigger('click');
            $(e.currentTarget)
              .find('.addToCartText')
              .text(
                i.hasClass('wk-add-product')
                  ? 'Remove from Wishlist'
                  : 'Add to Wishlist'
              );
          }
          $(this).blur();
        });
      } else {
        if (global.shipStates.indexOf('all') !== -1) return;
        if (global.shipStates.indexOf(this.getUserRegion()) === -1) {
          if (a) {
            $('body').addClass('is-wishlistOnly');
            $('main').addClass('hide-wkCartButtons');
            return;
          }

          global.addToWishlist = true;
          $('body').addClass('is-wishlistOnly');
          $('main').addClass('hide-wkCartButtons');
          $('.addToCart .addToCartText').text('Add to Wishlist');
          $('.addToCart').click(function(e) {
            e.preventDefault();
            if ($('body').hasClass('template-product'))
              $('.wishlist .wk-add-product').click();
            else
              $(this)
                .parents('.timber-activeProduct')
                .find('.wk-add-product')
                .click();
            $(this).blur();
          });
        }
      }
    }
  }

  global.BlueLikeNeon = BlueLikeNeon;
})(window, Cookies, jQuery);

((global, $) => {
  class DecathlonCustomer {
    constructor(e) {
      this.apiUrl = $('#decathlon-customer-api').data('apiRoot');
      this.messages = [];
      this.userData = e || {};
      this.customerId = e['customer[id]'];
      this.userMetaData = {};
    }

    createCustomer() {
      const i = this;
      i.messages = [];
      const n = i.userData;
      return new Promise((resolve, reject) => {
        i.checkEmail().then(a => {
          if (a && a.state === 'enabled') {
            const r = new Error(`${a.email} is already subscribed.`);
            r.code = 'USER_ENABLED';
            return reject(r);
          }
          if (a && a.state === 'disabled') {
            i.customerId = a.id;
            const r = new Error(`${a.email} is already subscribed.`);
            r.code = 'USER_NOT_ENABLED';
            return reject(r);
          }
          const s = {
            url: [i.apiUrl, 'customers'].join('/'),
            method: 'POST',
            headers: {
              'Content-type': 'application/json'
            },
            data: JSON.stringify(n)
          };
          $.ajax(s)
            .success(resolve)
            .error(reject);
        });
      });
    }

    updateCustomer(e) {
      const i = this;
      var e = e || {};
      const n = e;

      i.customerToken = i.userData.customer.token;
      delete i.userData.customer.token;
      if (!i.customerToken) console.log('[Error]: Token missing');
      return new Promise((resolve, reject) => {
        $.ajax({
          url: [i.apiUrl, 'customers'].join('/'),
          method: 'PUT',
          headers: {
            'Content-type': 'application/json',
            'X-Decathlon-CustomerAccessToken': i.customerToken
          },
          data: JSON.stringify(i.userData.customer)
        })
          .success(a => {
            if (a.errors) reject(a.errors);
            else if (a.errorType && a.errorType === 'TokenExpiredError')
              i.updateToken().success(o => {
                if (o.errorMessage) alert(o.errorMessage);
                else {
                  $('input[name="token"]').val(o.metafield.value);
                  i.userData.customer.token = o.metafield.value;
                  resolve(i.updateCustomer(n));
                }
              });
            else resolve(a);
          })
          .error(reject);
      });
    }

    checkEmail() {
      const e = this;
      return new Promise(resolve => {
        const o = e.userData.customer.email || e.userData['customer[email]'];
        $.get([e.apiUrl, 'check-email', o].join('/')).success(t => {
          if (!t.customers.length) return resolve(false);
          const n = t.customers[0];
          e.customerId = n.id;
          resolve(n);
        });
      });
    }

    shopifyLogin() {
      const i = this;
      $.post('/account/login', i.userData)
        .success((t, i) => {
          if (i === 'success') global.location = '/account';
        })
        .error(() => {
          alert('there was an error logging in');
        });
    }

    updateMetafield(e) {
      const i = this;
      const n = e;

      i.customerToken = i.userData.customer.token;
      if (!i.customerToken) console.log('[Error]: Token missing');
      return new Promise((resolve, reject) => {
        $.ajax({
          url: [i.apiUrl, 'metafields'].join('/'),
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            'X-Decathlon-CustomerAccessToken': i.customerToken
          },
          data: JSON.stringify(e)
        })
          .success(e => {
            if (e.errors) reject(e.errors);
            else if (e.errorType && e.errorType === 'TokenExpiredError')
              i.updateToken().success(e => {
                if (e.errorMessage) alert(e.errorMessage);
                else {
                  $('input[name="token"]').val(e.metafield.value);
                  i.userData.customer.token = e.metafield.value;
                  resolve(i.updateMetafield(n));
                }
              });
            else resolve(e);
          })
          .error(reject);
      });
    }

    registerExistingUser() {
      const e = this;
      const i = this.userData;

      i.customer.id = e.customerId;
      return $.ajax({
        url: [e.apiUrl, 'register-existing-user'].join('/'),
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        data: JSON.stringify(i)
      });
    }

    updateToken() {
      const e = this;
      return $.ajax({
        url: [e.apiUrl, '/customers/update-token'].join('/'),
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'X-Decathlon-CustomerAccessToken': e.customerToken
        }
      });
    }
  }

  global.DecathlonCustomer = DecathlonCustomer;
})(window, jQuery);
((global, $, BlueLikeNeon, Handlebars, DecathlonCustomer) => {
  const s = '//reviews.decathlon.com';
  const c = 768;
  const l = 1e3;
  // Used in recently viewed? And legacy product page?
  Handlebars.registerHelper('ratings', e => {
    const t = [];
    e = Math.floor(e);
    for (let i = 0; i < 5; ++i)
      if (i < e) t.push('<i class="ico ico--star u-textYellow"></i>');
      else t.push('<i class="ico ico--star"></i>');
    return new Handlebars.SafeString(t.join(''));
  });
  // Used in legacy product page
  Handlebars.registerHelper('inflection', (e, t) => {
    if (e !== 1) t += 's';
    return t;
  });
  // Used in legacy product page, that is probably it
  Handlebars.registerHelper('date', e => {
    e = e.split('T')[0];
    const t = new Date(e);
    return `${String(t.getMonth() + 1)}/${t.getDate()}/${t
      .getFullYear()
      .toString()
      .substr(2)}`;
  });
  $(() => {
    function scrollToTop() {
      global.scrollTo(0, 0);
    }

    function preventEventDefault(e) {
      e.preventDefault();
    }

    function f() {
      decathlon.setData('seenGateway', new Date().getTime());
      $(global).off('scroll', scrollToTop);
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

    function m() {
      $('body').removeClass('is-showingBanner is-rollingUpBanner');
      $('.popup').remove();
      global.scrollTo(0, 0);
      decathlon.setData('seenBanner', new Date().getTime());
    }

    function g() {
      const e = U.find('.slick-slide.slick-active');
      U.css('width', e.first().outerWidth(true) * e.length);
    }

    function h() {
      const n = $(global).width() > c ? 100 : 500;
      if ($(global).scrollTop() > n) $('.js-sticky-btn').slideDown();
      else $('.js-sticky-btn').slideUp();
    }

    function v(e) {
      const currentSlide = $(e.currentTarget).find('.slick-current');
      currentSlide.addClass('is-loadingZoom');
      currentSlide.zoom({
        url: currentSlide.find('img').data('original'),
        callback() {
          currentSlide.removeClass('is-loadingZoom');
        }
      });
    }

    function updateProductSlides() {
      const currentIndex = $('.js-slick--products .slick-current').data(
        'slick-index'
      );
      const numSlides = $(
        '.js-slick--products .slick-slide:not(.slick-cloned)'
      );
      const productImages = $('.productImages');
      if ($(global).width() <= c) {
        productImages.css('margin-left', 0);
      } else {
        if (numSlides.length < 4 && currentIndex == 0)
          productImages.css('margin-left', global.innerWidth / 3);
        else if (numSlides.length == 3 && currentIndex == 2)
          productImages.css('margin-left', -global.innerWidth / 3);
        else productImages.css('margin-left', 0);
        if (G) {
          G = false;
          setTimeout(() => {
            $('.productImages').removeClass('is-instant');
          }, 310);
        }
      }
    }

    function y() {
      let i =
        $(global).height() -
        $('.js-de-PageWrap-header').height() -
        $('.productOptions').height() -
        182;
      if (i > 500) {
        const n = 0.5 * (i - 500);
        $('.productImages').css({
          padding: `${n}px 0`
        });

        i = 500;
      } else
        $('.productImages').css({
          padding: 0
        });
      $('.productImage').height(i);
    }

    function w(e) {
      if (window.reviewsflushlist) {
        $('.js-reviews .productReview').remove();
        window.reviewsflushlist = false;
      }
      if (e.total_item_count > 0) {
        if (!window.reviewsinitialized) {
          $('.js-reviewsContainer').removeClass('u-displayNone');
          $('.js-productAggregateRating').html(window.starsTemplate(e));
          $('.js-productAggregateRating').on('click', () => {
            $(document).scrollTop($('#reviews').offset().top - 70);
          });
          window.reviewsinitialized = true;
        }
        $(e.items).each((e, t) => {
          t.country = t.country_label[t.country];
          t.helpfulUrl = t.url_vote.split('/');
          t.helpfulUrl.splice(t.helpfulUrl.length - 1, 0, 'useful');
          t.helpfulUrl = t.helpfulUrl
            .join('/')
            .replace('utility/view', 'utility/vote');
          t.notHelpfulUrl = t.helpfulUrl.replace('useful', 'useless');
          if (t.answer)
            t.answer.helpfulUrl = t.helpfulUrl.replace(t.id, t.answer.id);
        });
        $('.js-reviews .productReview')
          .last()
          .addClass('u-marginBottom2x');
        $('.js-reviews > .grid--full').append(
          productReviewsTemplate({
            reviews: e.items
          })
        );

        $('.js-reviewFeedback').on('click', e => {
          e.preventDefault();
          $.get(e.currentTarget.href).then(e => {
            console.log(e);
          });
        });
        if (3 * q >= Q.total_item_count) $('.js-loadReviews').hide();
        else $('.js-loadReviews').show();
      }
    }

    class CustomDropdown {
      constructor($elements) {
        this.dd = $elements;
        this.placeholder = this.dd.children('p');
        this.opts = this.dd.find('ul > li');
        this.val = '';
        this.index = -1;
        this.initEvents();
      }

      // T(e).on("resize", function(e) {
      //     t(".site-nav__dropdown").css({
      //         width: t(".js-de-PageWrap-header .wrapper").width()
      //     })
      // }),
      initEvents() {
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
          this.val = element.text();
          this.index = element.index();
          this.placeholder.text(this.val);
        });
      }

      getValue() {
        return this.val;
      }

      getIndex() {
        return this.index;
      }
    }

    function updateInputEmptyClass(event) {
      if ($(event.currentTarget).val())
        $(event.currentTarget)
          .parent()
          .addClass('is-notEmpty');
      else
        $(event.currentTarget)
          .parent()
          .removeClass('is-notEmpty');
    }
    $.fn.serializeObject = function() {
      const e = {};
      const i = this.serializeArray();

      $.each(i, function() {
        if (e[this.name] !== undefined) {
          if (!e[this.name].push) e[this.name] = [e[this.name]];
          e[this.name].push(this.value || '');
        } else if (this.name.indexOf('.') > -1) {
          const t = this.name.split('.');
          e[t[0]] = e[t[0]] || {};
          const p = e[t[0]];
          p[t[1]] = this.value || '';
        } else e[this.name] = this.value || '';
      });
      return e;
    };
    if (new Function('/*@cc_on return document.documentMode===10@*/')())
      $('html').addClass('ie ie10');
    const decathlon = new BlueLikeNeon('decathlon_usa');
    const nativeAppCookie = new BlueLikeNeon('native_app_cookie');
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
    function getCountry(T) {
      // Try to get country from cookie data
      const loc = T.getData('locale');
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
    decathlon.getLocale();
    decathlon.fullscreen({
      offsetHeight: Math.floor($('.js-de-PageWrap-header').outerHeight())
    });

    $(global).bind('pageshow', () => {
      $('.js-nobfcache').val('');
    });
    let getHeaderHeight = () =>
      Math.floor($('.js-de-PageWrap-header').outerHeight());
    decathlon.pinToHeader({
      selector: '.js-pinToHeader',
      offset: getHeaderHeight
    });
    const x = $('.js-pinToHeader--second');
    if (x.length !== 0) {
      getHeaderHeight = () => 0;
      decathlon.pinToHeader({
        selector: '.js-pinToHeader--second',
        offset: getHeaderHeight
      });
    }

    decathlon.anchorLinks(getHeaderHeight);
    $(global).scroll();
    loadImages();
    let lastHeight = 0;
    const pageContainer = $('#PageContainer');
    setInterval(() => {
      const height = pageContainer.innerHeight();
      if (height != lastHeight) {
        pageContainer.trigger($.Event('resize'));
        lastHeight = height;
      }
    }, 50);
    $('.header-search-mobile-btn').click(function() {
      if (!$('.mobile-searchWrapper').hasClass('open')) {
        $(this).addClass('search-open');
        $('.mobile-searchWrapper').addClass('open');
      }
    });
    $('.mobile-search__close').click(function() {
      $(this).removeClass('search-open');
      $('.header-search-mobile-btn').removeClass('search-open');
      $('.mobile-searchWrapper').removeClass('open');
    });
    $('.mobile-nav__item a').each(function() {
      if ($(this).attr('href') == '/account')
        $(this)
          .parent()
          .addClass('account-item');
    });
    // T(".account-item").before('<li class="mobile-nav__item"><a href="/pages/wishlist" class="mobile-nav__link">My Wishlist</a></li>'),
    $('.mobile-nav__has-sublist .mobile-nav__link').on('click', e => {
      const parent = $(e.currentTarget).parent();
      if (!parent.hasClass('mobile-nav--expanded')) {
        e.preventDefault();
        parent.toggleClass('mobile-nav--expanded');
      }
    });
    $('.mobile-nav__has-sublist > .mobile-nav__link:first-child').each(
      function() {
        if ($(this).text() === 'Get going packs') {
          $(this)
            .parent()
            .find('.mobile-nav__toggle')
            .remove();
          $(this)
            .parent()
            .parent()
            .find('.mobile-nav__sublist')
            .remove();
        }
        $(this).on('click', e => {
          global.location = $(e.currentTarget).attr('href');
        });
      }
    );

    // T("#customer_login_link").parent().hide();
    // t("#customer_register_link").parent().hide();
    // t("#NavDrawer .drawer__title").addClass("h5").removeClass("h3").html('<a href="/account"><i class="ico ico--account mobileHeader-accountIcon"></i>My Account</a>');

    // Get Country
    const country = getCountry(decathlon);
    if (
      !isMobileDevice() &&
      !isProductPage() &&
      country[0] != 'US' &&
      $('#gateway').length
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

        if (country[1] && country[1] != 'undefined') {
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
      $(global).on('scroll', scrollToTop);
      $('#gateway').on('touchmove', preventEventDefault);
      $('#gateway .close-popup-btn').on('click', f);
      $('#gateway .js-closePopup').on('click', e => {
        e.preventDefault();
        f();
      });
    }
    if (
      !isMobileDevice() &&
      !isProductPage() &&
      !fromAllowedState(decathlon) &&
      country[0] == 'US' &&
      !decathlon.getData('seenGateway') &&
      !nativeAppCookie.getData('noGateway') &&
      $('#gateway').length
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
      $(global).on('scroll', scrollToTop);
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
        if (!(r.val() && r.val() != '')) a.push('Please select a state');
        const s = /\S+@\S+\.\S+/;
        if (!s.test(n.find('#GatewayFormEmail').val()))
          a.push('Invalid email.');
        if (a.length) {
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
              global.addToWishlist = true;
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
    if ($('body').hasClass('template-index')) {
      $(global).on('scroll', h);
      h();
      if (!decathlon.getData('seenBanner') && $('.popup').length) {
        const B = $(global).height();
        $('body').addClass('is-showingBanner');
        $('.popup').css('height', B);
        setTimeout($('.popup-logo').fadeIn(500), 2e3);
        setTimeout($('.popup-content').fadeIn(500), 3e3);
        $('.popup .close-popup-btn').on('click', () => {
          $('body').addClass('is-rollingUpBanner');
          setTimeout(m, 1260);
        });
        $('.popup .js-closePopup').on('click', e => {
          e.preventDefault();
          $('body').addClass('is-rollingUpBanner');
          setTimeout(m, 1260);
        });
        $('.js-seenBanner').on('click', () => {
          decathlon.setData('seenBanner', new Date().getTime());
        });
        $(global).on('scroll', () => {
          if (
            $(global).scrollTop() > B &&
            $('body').hasClass('is-showingBanner')
          )
            m();
        });
        $(global).on('resize', () => {
          $('.popup').css('height', $(global).height());
        });
      }
      var U = $('.sportsSearch .slick-slider');
      if ($(global).width() > 1520) g();
    }
    if (!decathlon.getData('seenPromo')) {
      $('.promo-band').removeClass('is-hidden');
      $('.promo-band__close').click(() => {
        $('.promo-band').addClass('close');
        decathlon.setData('seenPromo', new Date().getTime());
      });
    }
    $('.js-bannerVideo').on('click', function(event) {
      event.preventDefault();
      const n = $(this).parents('.banner--video');
      const o = $(this)
        .attr('href')
        .replace('https://www.youtube.com/watch?v=', '');
      n.append(
        `<div id="bannerVideo"><div class="js-closeBannerVideo"></div><div class="embedWrapper"><div class="embedContainer"><iframe src="https://www.youtube.com/embed/${o}?autoplay=1&rel=0" frameborder="0" allowfullscreen></iframe></div></div></div>`
      );
      if ($(this).attr('data-videoButton')) {
        const a = JSON.parse($(this).attr('data-videoButton'));
        $('#bannerVideo').append(
          `<p class="bannerButton"><a class="btn" href="${a.url}">${a.text}</a></p>`
        );
      }
      n.addClass('banner--videoActive');
      $('.js-closeBannerVideo').click(() => {
        n.removeClass('banner--videoActive');
        if ($(global).width() >= c) $('#bannerVideo').remove();
        else
          setTimeout(() => {
            $('#bannerVideo').remove();
          }, 750);
      });
    });
    if (
      $('body').hasClass('template-collection') ||
      $('body').hasClass('template-list-collections')
    ) {
      $('.js-toggleCollectionSidebar').on('click', e => {
        e.preventDefault();
        $(e.currentTarget)
          .parents('.collectionSidebar')
          .toggleClass('is-open');
      });
      $('.js-tagLink').each(function() {
        const i = $(this).attr('href');
        const n = global.location.pathname;
        const o = n.split('/').splice(1);
        const a = '/';
        if (o.length < 3) {
          $(this).attr('href', [n, i].join(a));
          return;
        }
        const r = o.pop().split('+');
        const s = r.indexOf(i);
        const c = o.join('/');
        if (s === -1) r.push(i);
        else r.splice(s, 1);
        const l = ['', c, r.join('+')].join(a).replace(/\/$/, '');
        $(this).attr('href', l);
      });
    }

    if ($('body').hasClass('template-product')) {
      const productWrap = $('#ProductWrap');
      const modelCode = productWrap.data('modelCode');
      $(global).on('scroll', h);
      h();
      if (!productWrap.hasClass('product-singleOption'))
        decathlon.optionToSwatch().then(() => {
          $('.selector-wrapper--color .custom-variants').slick({
            slidesToShow: 5,
            arrows: true,
            infinite: false,
            responsive: [
              {
                breakpoint: 1120,
                settings: { slidesToShow: 3 }
              },
              {
                breakpoint: 1e3,
                settings: { slidesToShow: 5 }
              },
              {
                breakpoint: 600,
                settings: { slidesToShow: 3 }
              },
              {
                breakpoint: 480,
                settings: { slidesToShow: 5 }
              }
            ]
          });
        });
      if (
        decathlon.cookieData_.recentlyViewed &&
        decathlon.cookieData_.recentlyViewed.length > 0
      ) {
        const W = handlebarsSafeCompile($('#recentlyViewedTemplate').html());
        $('.js-recentlyViewed').html(
          W({
            products: decathlon.cookieData_.recentlyViewed
          })
        );
      } else $('.recentlyViewed').remove();
      decathlon.recentlyViewed({
        url: `/products/${window.productJSON.handle}`,
        title: window.productJSON.title,
        price: `$${window.productJSON.price / 100}`,
        featured_image: window.productJSON.featured_image,
        id: window.productJSON.id,
        rating: window.productJSON.rating
      });

      $('.js-slick--products')
        .on('beforeChange', e => {
          $(e.currentTarget)
            .find('.slick-current')
            .trigger('zoom.destroy');
        })
        .on('afterChange', v)
        .on('init', v);
      $('.js-slick--products').slick({
        centerPadding: 0,
        dots: true,
        focusOnSelect: true,
        infinite: true,
        slidesToShow: 3,
        centerMode: true,
        lazyLoad: 'ondemand',
        responsive: [
          {
            breakpoint: 769,
            settings: {
              slidesToShow: 1,
              infinite: false,
              dots: false
            }
          }
        ]
      });
      var G = true;
      $('.js-slick--products').on('afterChange', updateProductSlides);
      $('.selector-wrapper--color .option').on('click', updateProductSlides);
      $('.js-slick--products .productImage').click(updateProductSlides);
      $(global).resize(updateProductSlides);
      if ($(global).width() <= c)
        $('.productImage.slick-slide img').removeAttr('data-action');
      if ($(global).width() >= l) {
        y();
        $(global).resize(y);
        decathlon.pinToHeader({
          selector: '.js-pinProductOptions',
          offset() {
            return 0;
          },
          pinCallback() {
            $(document.body).addClass('is-pinningForm');
          },
          unpinCallback() {
            $(document.body).removeClass('is-pinningForm');
          }
        });
      }

      const H = decathlon.imageGroups().getGroups();
      $(H).each((e, i) => {
        $(i.images).each((e, n) => {
          let o = n.replace(/^https:/, '').split('.jpg');
          o = o.join('_large.jpg');
          $(`.productImage img[data-lazy="${o}"]`)
            .parent()
            .attr('data-color', i.color);
        });
      });
      $('.js-slick--products').on('reInit', function() {
        $(this).removeClass('is-filtering');
      });
      $('.js-slick--products').slick('slickFilter', function() {
        if ($(this).data('color') === H[0].color) return true;
      });
      $('.js-slick--products .slick-slide:not(.slick-cloned)').each((e, i) => {
        $(i).attr('data-slick-index', e);
      });

      $('.productFAQs h4').each((e, i) => {
        $(i).addClass('productFAQs-faq-title');
        $(i)
          .nextUntil('h4')
          .addBack()
          .wrapAll('<div class="productFAQs-faq" />');
        $(i).append(
          '<a class="productFAQs-faq-toggleLink js-toggleFAQ" href="#"></a>'
        );
      });
      $('.js-toggleFAQ').on('click', function(e) {
        e.preventDefault();
        $(this)
          .parents('.productFAQs-faq')
          .toggleClass('is-open');
      });
      if (modelCode) {
        const V = $('.js-loadProductVideo');
        if (V)
          $.ajax({
            url: V.data('poster'),
            type: 'HEAD'
          })
            .success(() => {
              V.append(
                `<div class="banner banner--video banner--billboard banner--centeredContent banner--productVideo" style="background-image: url(${V.data(
                  'poster'
                )})" ><div class="wrapper"><div class="banner-content"><h1 class="banner-title">See it in action</h1><a class="js-bannerVideo" href="//players.brightcove.net/3415345270001/rJxNjfhX_default/index.html?videoId=ref:${V.data(
                  'videoId'
                )}_1&secureConnections=true&secureHTMLConnections=true&autoplay=true" target="_blank"><i class="ico ico--play h2 u-marginBottom0x"></i></a></div></div></div>`
              );

              $('.js-bannerVideo').on('click', function(i) {
                i.preventDefault();
                const n = $(this).parents('.banner--video');
                const o = $(this).attr('href');
                n.append(
                  `<div id="bannerVideo"><div class="js-closeBannerVideo"></div><div class="embedWrapper"><div class="embedContainer"><iframe src="${o}" frameborder="0" allowfullscreen></iframe></div></div></div>`
                );
                if ($(this).attr('data-videoButton')) {
                  const a = JSON.parse($(this).attr('data-videoButton'));
                  $('#bannerVideo').append(
                    `<p class="bannerButton"><a class="btn" href="${a.url}">${a.text}</a></p>`
                  );
                }
                n.addClass('banner--videoActive');
                $('.js-closeBannerVideo').click(() => {
                  n.removeClass('banner--videoActive');
                  if ($(global).width() >= c) $('#bannerVideo').remove();
                  else
                    setTimeout(() => {
                      $('#bannerVideo').remove();
                    }, 750);
                });
              });
            })
            .fail(() => {
              V.append(
                `<div id="bannerVideo"><div class="embedWrapper"><div class="embedContainer"><iframe src="//players.brightcove.net/3415345270001/S1PSLnzml_default/index.html?videoId=ref:${V.data(
                  'videoId'
                )}_1&secureConnections=true&secureHTMLConnections=true" frameborder="0" allowfullscreen=""></iframe></div></div></div>`
              );
            });
        var J = `${s}/api/en_US/review/list?site=1132&type=1&locales=en&nb=3&offer=`;
        var productReviewsTemplate = handlebarsSafeCompile(
          $('#productReviewsTemplate').html()
        );
        var q = 0;
        var Q = $('#productAggregateRating').data('reviews');
        window.starsTemplate = handlebarsSafeCompile(
          $('#productAggregateRating').html()
        );

        window.reviewsflushlist = false;
        window.reviewsinitialized = false;

        const loadReviews = () => {
          if (window.reviewsflushlist) q = 0;
          const e = (
            $('.js-productReviewsSort').val() || 'createdAt|desc'
          ).split('|');
          const i = 3 * q;
          q++;
          if (!(!Q || i >= Q.total_item_count))
            if (e[0] == 'createdAt' && e[1] == 'desc' && q <= 5)
              w({
                total_item_count: Q.total_item_count,
                items: Q.items.slice(i, i + 3)
              });
            else
              $.get(
                `${J + modelCode}&page=${q}&sort=${e[0]}&direction=${e[1]}`
              ).then(w);
        };

        loadReviews();
        $('.js-loadReviews').click(e => {
          e.preventDefault();
          loadReviews();
        });
        $('.js-productReviewsSort').change(() => {
          window.reviewsflushlist = true;
          loadReviews();
        });
      }
      const variantId = decode(location.search.substring(1));
      if (variantId) {
        const K = $(`option[value="${variantId}"]`).text();
        $('.selector-wrapper--color .option').each(function() {
          const e = $(this);
          if (K.indexOf(e.data('value')) > -1) e.click();
        });
      }
      $('body').append($('.sizechart').detach());
      const X = /iPhone/.test(navigator.userAgent) && !global.MSStream;
      let Y = false;
      $('.js-sizechart').click(i => {
        i.preventDefault();
        if ($(global).width() < 768)
          $('html, body').css({
            overflow: 'hidden',
            position: 'fixed'
          });
        if (!Y) {
          var n = setInterval(() => {
            if ($('.sizeGuide').html() != '') {
              const e = $('.esc-size-guide--title')
                .text()
                .replace(
                  /\(.*\)/,
                  e => `<br/><span style="font-size:60%">${e}</span>`
                );
              $('.sizechart-title').html(e);
              $('.sizechart-measurements').html(
                $('.esc-size-guide--table + p').html()
              );

              clearInterval(n);
            }
          }, 100);
          Y = true;
          if (X)
            $('.sizechart .u-centerVertically').removeClass(
              'u-centerVertically'
            );
        }
        $('.sizechart').css('display', 'block');
        $('html').addClass('is-showingSizeChart');
      });
      $('.js-closeSizechart').click(() => {
        if ($(global).width() < 768)
          $('html, body').css({
            overflow: '',
            position: ''
          });

        $('.sizechart').css('display', 'none');
        $('html').removeClass('is-showingSizeChart');
      });
    }
    $('.js-slick--attr').slick();
    const ee = [];
    $('.js-slick--attr').each(function() {
      const $this = $(this);
      const n = $this.data('slick');
      if (n && n.responsive)
        for (let o = 0; o < n.responsive.length; o++)
          if (n.responsive[o].settings == 'unslick') {
            ee.push({
              element: $this,
              breakpoint: n.responsive[o].breakpoint,
              active: $(global).width() <= n.responsive[o].breakpoint
            });
            $this.data('slickBreakIndex', ee.length - 1);
          }
    });
    $(global).resize(() => {
      for (let i = $(global).width(), n = 0; n < ee.length; n++)
        if (!ee[n].active && i <= ee[n].breakpoint) {
          ee[n].element.slick();
          ee[n].active = true;
        }
    });
    $('.js-slick--attr').on('destroy', function() {
      for (let i = $(this), n = 0; n < ee.length; n++) {
        const o = i.data('slickBreakIndex');
        if (o !== undefined) ee[o].active = false;
      }
    });
    setTimeout(() => {
      $(global).resize();
    }, 1500);
    $('.js-slick--attr .collectionProduct-relative').hover(
      function() {
        const i = $(this).parents('.slick-slider');
        i.css('height', i.innerHeight()).addClass(
          'slickSlider-collectionProductFix'
        );
      },
      function() {
        const i = $(this).parents('.slick-slider');
        i.css('height', '').removeClass('slickSlider-collectionProductFix');
      }
    );

    $('.js-colorChip').on('mouseenter', e => {
      e.preventDefault();
      const i = new Image();
      i.src = $(e.currentTarget).data('image');
    });
    $('.js-colorChip').on('click', e => {
      e.preventDefault();
      $(e.currentTarget)
        .parents('.collectionProduct')
        .find('.collectionProduct-image')
        .attr('src', $(e.currentTarget).data('image'));
      if ($(e.currentTarget).data('compare')) {
        $(e.currentTarget)
          .parents('.collectionProduct')
          .find('.collectionProduct-price')
          .html(
            `<span style='color: #E53322;'>${$(e.currentTarget).data(
              'price'
            )}</span><span class='visually-hidden'>Regular price</span><br><s>${$(
              e.currentTarget
            ).data('compare')}</s>`
          );
      } else {
        $(e.currentTarget)
          .parents('.collectionProduct')
          .find('.collectionProduct-price')
          .html($(e.currentTarget).data('price'));
      }
      $(e.currentTarget)
        .parent()
        .attr('data-colorChoice', $(e.currentTarget).data('color'));
      $(e.currentTarget)
        .parent()
        .attr('data-variantChoice', $(e.currentTarget).data('variant'));
      $(e.currentTarget)
        .parent()
        .find('.option.option--active')
        .removeClass('option--active');
      $(e.currentTarget).addClass('option--active');
    });
    if (global.attachOptionSelectors) global.attachOptionSelectors();
    $('.collectionProduct .js-shopNow').click(function(i) {
      i.preventDefault();
      const n = $(this)
        .parents('.collectionProduct')
        .find('.collectionProduct-colors')
        .data('variantchoice');
      global.location.href = `${$(this).attr('href')}?variantid=${n}`;
    });
    $('.js-adjustFeaturedContent').each(function() {
      if (
        $(this)
          .prev()
          .hasClass('collectionProduct--featured')
      )
        $(this).removeClass('collectionProduct--featured--end');
      else
        $(this)
          .prev()
          .addClass('collectionProduct--nextIsEndFeatured');
    });
    if ($(global).width() > c)
      $(
        '.getGoingPack-currentProductWrapper .slick-slide:first-of-type img'
      ).on('load', () => {
        decathlon.getGoingPacks();
      });
    $('.js-slick--attr')
      .first()
      .on('setPosition', () => {
        setTimeout(() => {
          decathlon.getGoingPacks($(global).width() <= c);
        }, 250);
      });
    $('body').append($('.appointment').detach());
    $('.js-sanFranAppt').click(e => {
      e.preventDefault();
      $('.appointment').css('display', 'block');
    });
    $('.js-closeAppt').click(() => {
      $('.appointment').css('display', 'none');
    });
    if (
      global.location.pathname === '/pages/san-francisco' &&
      $('.appointment .form-success').length > 0
    ) {
      $('.btn.js-sanFranAppt').click();
      $('.appointment .hide-on-success').css('display', 'none');
      $('.js-closeAppt').click(() => {
        global.history.pushState({}, '', global.location.href.split('?')[0]);

        $('.appointment .hide-on-success').css('display', 'block');
        $('.appointment .form-success').css('display', 'none');
      });
    }
    const te = new Date();
    const ie = te.getUTCDay();
    const ne = te.getUTCHours() - 8;
    let oe = false;
    $('.js-storeOpen p[data-day-info]').each((e, i) => {
      const n = $(i)
        .data('dayInfo')
        .split(',');
      if (ie >= parseInt(n[0]) && ie <= parseInt(n[1])) {
        $(i).addClass('is-active');
        if (ne >= parseInt(n[2]) && ne < parseInt(n[3])) oe = true;
      }
    });
    if (oe) $('.js-storeOpen').addClass('storeHours--open');
    if ($('body').hasClass('template-customers-register')) {
      if (global.location.search) {
        const ae = global.location.search.substring(1).split('&');
        $(ae).each((e, i) => {
          const n = i.split('=');
          $(`input[name="${n[0]}"]`).val(n[1]);
        });
      }
      $('.js-editProfileImage').on('click', e => {
        e.preventDefault();
        $('.imageUploadForm').removeClass('visually-hidden');
        $(e.currentTarget).addClass('visually-hidden');
      });
      $('#imageFiles').on('change', e => {
        const i = $(e.currentTarget).prop('files');
        const n = i[0];
        const o = n.name.split('.').pop();
        const a = `images/${uuid().replace(/-/g, '')}.${o}`;
        s3.upload(
          {
            Key: a,
            Body: n,
            ACL: 'public-read',
            ContentType: `image/${o}`
          },
          (e, i) => {
            if (e) {
              console.log(e);
              alert('There was an error uploading your image.');
            } else {
              $('input[name="image_upload"]').val(i.Location);
              $('.imageUpload, .js-editProfileImage').removeClass(
                'visually-hidden'
              );
              $('.profilePic').attr('src', i.Location);
              $('.imageUploadForm').addClass('visually-hidden');
            }
          }
        );
      });
      $('.js-createCustomer').on('submit', function(e) {
        const i = $(this);
        const n = $(e.currentTarget).serializeObject();
        let a = false;
        const r = $(e.currentTarget).find('.notifications');
        const s = new DecathlonCustomer({
          customer: {
            first_name: n['customer[first_name]'],
            last_name: n['customer[last_name]'],
            accepts_marketing: n['customer[accepts_marketing]'],
            email: n['customer[email]']
          }
        });

        r.removeClass('form-success')
          .removeClass('form-error')
          .empty();
        e.preventDefault();
        let c = 'All fields are required';
        i.find('input:not(.ignore)').each((e, i) => {
          if ($(i).val() === '') a = true;
        });
        if (!/\S+@\S+\.\S+/.test($('input[name="customer[email]"]').val())) {
          c = 'Invalid email';
          a = true;
        }
        if (a) {
          r.addClass('form-error').html(`<p>${c}</p>`);
          return;
        }
        s.userData.customer.send_email_invite = true;
        const l = {
          namespace: 'customers',
          key: 'profile_image',
          value: $('input[name="image_upload"]').val(),
          value_type: 'string'
        };
        if ($('input[name="image_upload"]').val()) {
          s.userData.customer.metafields = [l];
          i.append(
            '<input type="hidden" name="customer[metafields][0][namespace]" value="customers" />'
          );

          i.append(
            '<input type="hidden" name="customer[metafields][0][key]" value="profile_image" />'
          );

          i.append(
            `<input type="hidden" name="customer[metafields][0][value]" value="${l.value}" />`
          );

          i.append(
            '<input type="hidden" name="customer[metafields][0][value_type]" value="string" />'
          );
        }

        s.createCustomer()
          .then(e => {
            i.find(':not(.notifications)').remove();
            if (e.errors) {
              if (e.errors.email[0] == 'has already been taken')
                r.addClass('form-error')
                  .html(
                    '<p>The email address you entered is already associated with a Decathlon account. Please log in to that account, or enter a different email address to create a new Decathlon account.</p>'
                  )
                  .after(
                    '<p class="u-marginTop1x text-center"><a class="btn btn--text" href="/account/login">Sign In</a></p>'
                  )
                  .after(
                    '<p class="u-marginTop1x"><a class="btn btn--fill btn--full" href="/account/register">Create Account</a></p>'
                  );
              else r.addClass('form-error').html('<p>Unknown Error</p>');
            } else {
              r.addClass('form-success').html(
                '<p>Please check your email to continue account&nbsp;activation</p>'
              );
            }
          })
          .catch(error => {
            if (error.code === 'USER_NOT_ENABLED')
              s.registerExistingUser()
                .success(() => {
                  i.unbind('submit').submit();
                })
                .error(e => {
                  console.log('error', e);
                });
            if (error.code === 'USER_ENABLED') {
              i.find(':not(.notifications)').remove();
              r.addClass('form-success').append(
                '<p>You already have an account, <a href="/account/login">please&nbsp;login</a></p>'
              );
            }
          });
      });
    }
    if ($('body').hasClass('template-customers-account')) {
      $('.js-editProfileImage').on('click', e => {
        e.preventDefault();
        $('.imageUploadForm').removeClass('visually-hidden');
        $(e.currentTarget).addClass('visually-hidden');
      });
      $('#imageFiles').on('change', e => {
        const i = $(e.currentTarget).prop('files');
        const n = i[0];
        const a = n.name.split('.').pop();
        const r = `images/${uuid().replace(/-/g, '')}.${a}`;
        s3.upload(
          {
            Key: r,
            Body: n,
            ACL: 'public-read',
            ContentType: `image/${a}`
          },
          (i, n) => {
            if (i) {
              console.log(i);
              return alert('There was an error uploading your image.');
            }

            const a = $(e.currentTarget)
              .parents('.js-updateCustomer')
              .find('input[name="token"]')
              .val();
            const r = new DecathlonCustomer({
              customer: {
                token: a
              }
            });
            r.updateMetafield({
              namespace: 'customers',
              key: 'profile_image',
              value: n.Location,
              value_type: 'string'
            }).then(e => {
              $('.imageUpload, .js-editProfileImage').removeClass(
                'visually-hidden'
              );

              $('.profilePic').attr('src', e.metafield.value);
              $('.imageUploadForm').addClass('visually-hidden');
            });
          }
        );
      });
      $('.js-updateCustomer').on('submit', e => {
        e.preventDefault();
        const i = new DecathlonCustomer({
          customer: $(e.currentTarget).serializeObject()
        });
        const n = $(e.currentTarget).find('.notifications');
        n.removeClass('form-success')
          .removeClass('form-error')
          .empty();
        if (!i.userData.customer.accepts_marketing)
          i.userData.customer.accepts_marketing = false;
        i.updateCustomer()
          .then(() => {
            n.addClass('form-success').append('<p>Saved successfully!</p>');
          })
          .catch(error => {
            const messages = [];
            if (error.email) messages.push(`Email ${error.email[0]}`);
            messages.forEach(e => {
              n.addClass('form-error').append(`<p>${e}</p>`);
            });
          });
      });
    }
    if ($('body').hasClass('template-customers-login')) {
      if (global.location.hash === '#recover') {
        $('#RecoverPassword').trigger('click');
        if (global.location.search === '?redirect_to=/account')
          $('#HideRecoverPasswordLink').on('click', () => {
            global.location = '/account';
          });
      }
      $('#customer_login').on('submit', function(e) {
        const i = $(this);
        const n = $(this).serializeObject();
        const a = new DecathlonCustomer({
          customer: {
            email: n['customer[email]']
          }
        });
        let r = false;
        console.log(a);
        e.preventDefault();
        const $notifications = $(e.currentTarget).find('.notifications');
        $notifications
          .removeClass('form-success')
          .removeClass('form-error')
          .empty();
        i.find('input').each((e, i) => {
          if ($(i).val() === '') r = true;
        });
        if (r)
          $notifications
            .addClass('form-error')
            .html('<p>All fields are required</p>');
        a.checkEmail().then(e => {
          if (e) {
            if (e.state !== 'enabled') {
              $notifications
                .removeClass('form-error')
                .addClass('form-success')
                .html(
                  `<p>Please <a href="/account/register?customer[email]=${e.email}">complete your profile</a></p>`
                );
            } else i.unbind('submit').submit();
          } else
            $notifications
              .addClass('form-error')
              .html('<p>No account found with that email.</p>');
        });
      });
    }
    if ($('body').hasClass('template-customers-addresses')) {
      if (global.location.hash === '#add') $('.js-addAddress').trigger('click');
      $('#address_form_new').submit(function(e) {
        const i = $(this);
        let n = true;

        i.find('[required]').each(function() {
          const e = $(this);
          if (e.val() == '') {
            e.css('border', '1px solid red');
            n = false;
          }
        });
        if (!n) {
          e.preventDefault();
          return false;
        }
      });
    }
    if ($('body').hasClass('page-checkout')) {
      const re = $('.main__content').data('userImg');
      if (re)
        $('.logged-in-customer-information__avatar').css({
          'background-image': `url(${re})`
        });
    }
    if (global.location.search === '?contact_posted=true')
      $('.hide-on-success').css('display', 'none');
    $('#contact_form').submit(function(e) {
      const i = $(this);
      const n = [];
      i.find('[required]').each(function() {
        const e = $(this);
        if (e.val() == '')
          n.push(
            `${$(this)
              .parent()
              .find('label')
              .text()} is required`
          );
      });
      const o = /\S+@\S+\.\S+/;
      if (!o.test(i.find('input[type="email"]').val()))
        n.push('Invalid email.');
      if (n.length) {
        $(e.currentTarget)
          .find('.form-vertical .notifications')
          .remove();
        $(e.currentTarget)
          .find('.form-vertical')
          .prepend(
            '<div class="notifications form-errors u-paddingTopBottom1x"><ul class="no-bullets u-marginBottom0x"></ul></div>'
          );

        $(n).each((i, n) => {
          $(e.currentTarget)
            .find('.notifications ul')
            .append(`<li>${n}</li>`);
        });
        return false;
      }
    });
    if (
      $('#create_customer .errors')
        .text()
        .indexOf('verify your email') > -1
    )
      $('#create_customer .errors').addClass(
        'notifications form-success u-textCenter'
      );

    $('.footerNewsletter-form, .blogNewsletter-form').submit(function(e) {
      e.preventDefault();
      const i = $(this);
      $('.newsLetterForm-response').remove();
      let n = true;
      var a = i.find('.state-dropdown-list .active input');
      if (a.length == 0) {
        var a = i.find('select');
        if (a.length == 0) n = false;
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
      if ($(global).width() >= 1e3 || i.target.nodeName == 'P')
        global.location.href = $(this).data('href');
    });

    $(() => {
      new CustomDropdown($('.footerNewsletter-dropdown-wrap'));
      $(document).click(() => {
        $('.footerNewsletter-dropdown-wrap').removeClass('active');
      });
    });
    $('.inputWrap > input, .inputWrap > select, .inputWrap > textarea').each(
      (e, i) => {
        if ($(i).val())
          $(i)
            .parent()
            .addClass('is-notEmpty');
      }
    );
    $('.inputWrap > select').on('change', updateInputEmptyClass);
    $('.inputWrap > input, .inputWrap > textarea').on(
      'keyup',
      updateInputEmptyClass
    );
    global.decathlon = decathlon;
  });
})(window, jQuery, BlueLikeNeon, Handlebars, DecathlonCustomer);
