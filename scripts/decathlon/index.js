import $ from 'jquery';
import './footer';
/* eslint-disable complexity, @cloudfour/no-param-reassign, no-redeclare, eqeqeq, no-negated-condition, radix, block-scoped-var, no-var, no-alert, no-new, @cloudfour/unicorn/explicit-length-check, max-params, no-new-func */
/* global Cookies, jQuery, BlueLikeNeon, s3, DecathlonCustomer */

const loadImages = () => {
  $('img[data-src]').each((i, el) => {
    $(el).attr('src', $(el).attr('data-src'));
  });
  $('[data-background-image]').each((i, el) => {
    $(el).css('background-image', `url(${$(el).data('backgroundImage')})`);
  });
};

/**
 * @see https://gist.github.com/jed/982883
 */
const uuid = t =>
  t
    ? (t ^ ((16 * Math.random()) >> (t / 4))).toString(16)
    : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);

window.uuid = uuid;

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

window.isProductPage = isProductPage;

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

window.getLocaleSync = getLocaleSync;

((global, Cookies, $) => {
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
    wishlistSwap(addToWishlist = global.addToWishlist) {
      const isLegacyProductPage = $('body').hasClass('template-product');
      const isSellableProduct =
        isLegacyProductPage && $('body').hasClass('is-sellableProduct');
      if (addToWishlist) {
        if (isSellableProduct) return;
        global.addToWishlist = true;
        $('main').addClass('hide-wkCartButtons');
        $('.addToCart .addToCartText, .js-addToWishlist .addToCartText').text(
          'Add to Wishlist'
        );

        $('.addToCart, .js-addToWishlist').click(function(e) {
          e.preventDefault();
          if (isLegacyProductPage)
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
          if (isSellableProduct) {
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
            if (isLegacyProductPage) $('.wishlist .wk-add-product').click();
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
    constructor(userData) {
      this.apiUrl = $('#decathlon-customer-api').data('apiRoot');
      this.messages = [];
      this.userData = userData || {};
      this.customerId = userData['customer[id]'];
      this.userMetaData = {};
    }

    createCustomer() {
      this.messages = [];
      const n = this.userData;
      return new Promise((resolve, reject) => {
        this.checkEmail().then(a => {
          if (a && a.state === 'enabled') {
            const r = new Error(`${a.email} is already subscribed.`);
            r.code = 'USER_ENABLED';
            return reject(r);
          }
          if (a && a.state === 'disabled') {
            this.customerId = a.id;
            const r = new Error(`${a.email} is already subscribed.`);
            r.code = 'USER_NOT_ENABLED';
            return reject(r);
          }
          const s = {
            url: [this.apiUrl, 'customers'].join('/'),
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
      var e = e || {};
      const n = e;

      this.customerToken = this.userData.customer.token;
      delete this.userData.customer.token;
      if (!this.customerToken) console.log('[Error]: Token missing');
      return new Promise((resolve, reject) => {
        $.ajax({
          url: [this.apiUrl, 'customers'].join('/'),
          method: 'PUT',
          headers: {
            'Content-type': 'application/json',
            'X-Decathlon-CustomerAccessToken': this.customerToken
          },
          data: JSON.stringify(this.userData.customer)
        })
          .success(a => {
            if (a.errors) reject(a.errors);
            else if (a.errorType && a.errorType === 'TokenExpiredError')
              this.updateToken().success(o => {
                if (o.errorMessage) alert(o.errorMessage);
                else {
                  $('input[name="token"]').val(o.metafield.value);
                  this.userData.customer.token = o.metafield.value;
                  resolve(this.updateCustomer(n));
                }
              });
            else resolve(a);
          })
          .error(reject);
      });
    }

    checkEmail() {
      return new Promise(resolve => {
        const email =
          this.userData.customer.email || this.userData['customer[email]'];
        $.get([this.apiUrl, 'check-email', email].join('/')).success(t => {
          if (!t.customers.length) return resolve(false);
          const n = t.customers[0];
          this.customerId = n.id;
          resolve(n);
        });
      });
    }

    shopifyLogin() {
      $.post('/account/login', this.userData)
        .success((t, i) => {
          if (i === 'success') global.location = '/account';
        })
        .error(() => {
          alert('there was an error logging in');
        });
    }

    updateMetafield(e) {
      const n = e;

      this.customerToken = this.userData.customer.token;
      if (!this.customerToken) console.log('[Error]: Token missing');
      return new Promise((resolve, reject) => {
        $.ajax({
          url: [this.apiUrl, 'metafields'].join('/'),
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            'X-Decathlon-CustomerAccessToken': this.customerToken
          },
          data: JSON.stringify(e)
        })
          .success(e => {
            if (e.errors) reject(e.errors);
            else if (e.errorType && e.errorType === 'TokenExpiredError')
              this.updateToken().success(e => {
                if (e.errorMessage) alert(e.errorMessage);
                else {
                  $('input[name="token"]').val(e.metafield.value);
                  this.userData.customer.token = e.metafield.value;
                  resolve(this.updateMetafield(n));
                }
              });
            else resolve(e);
          })
          .error(reject);
      });
    }

    registerExistingUser() {
      const userData = this.userData;

      userData.customer.id = this.customerId;
      return $.ajax({
        url: [this.apiUrl, 'register-existing-user'].join('/'),
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        data: JSON.stringify(userData)
      });
    }

    updateToken() {
      return $.ajax({
        url: [this.apiUrl, '/customers/update-token'].join('/'),
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'X-Decathlon-CustomerAccessToken': this.customerToken
        }
      });
    }
  }

  global.DecathlonCustomer = DecathlonCustomer;
})(window, jQuery);
((global, $, BlueLikeNeon, DecathlonCustomer) => {
  const breakpoint = 768;
  $(() => {
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
        if ($(global).width() >= breakpoint) $('#bannerVideo').remove();
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
    if ($(global).width() > breakpoint)
      $(
        '.getGoingPack-currentProductWrapper .slick-slide:first-of-type img'
      ).on('load', () => {
        decathlon.getGoingPacks();
      });
    $('.js-slick--attr')
      .first()
      .on('setPosition', () => {
        setTimeout(() => {
          decathlon.getGoingPacks($(global).width() <= breakpoint);
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
        const customer = new DecathlonCustomer({
          customer: $(e.currentTarget).serializeObject()
        });
        const notificationsEl = $(e.currentTarget).find('.notifications');
        notificationsEl
          .removeClass('form-success')
          .removeClass('form-error')
          .empty();
        if (!customer.userData.customer.accepts_marketing)
          customer.userData.customer.accepts_marketing = false;
        customer
          .updateCustomer()
          .then(() => {
            notificationsEl
              .addClass('form-success')
              .append('<p>Saved successfully!</p>');
          })
          .catch(error => {
            const messages = [];
            if (error.email) messages.push(`Email ${error.email[0]}`);
            messages.forEach(e => {
              notificationsEl.addClass('form-error').append(`<p>${e}</p>`);
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
        const customer = new DecathlonCustomer({
          customer: {
            email: n['customer[email]']
          }
        });
        let r = false;
        console.log(customer);
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
        customer.checkEmail().then(e => {
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
})(window, jQuery, BlueLikeNeon, DecathlonCustomer);
