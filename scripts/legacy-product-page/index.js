import { decode } from 'qss';
import $ from 'jquery';
import Handlebars from 'handlebars';
import './zoom';
import { ImageGroups } from './image-groups';

const uuid = window.uuid;
const slugify = e =>
  e
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

function optionToSwatch() {
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
      `<div class="options" data-option="${n.data('option')}">${options.join(
        ''
      )}</div>`
    );
    if (labelName !== 'Size') {
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
    if ($(this).find('.options .option').length === 1) {
      $(this)
        .find('.options .option')
        .first()
        .click();
    }
  });
  // Why does this return a promise?
  return Promise.resolve();
}

$(document).ready(() => {
  const decathlon = window.decathlon;

  const s = '//reviews.decathlon.com';
  const l = 1e3;

  Handlebars.registerHelper('ratings', e => {
    const t = [];
    const value = Math.floor(e);
    for (let i = 0; i < 5; ++i)
      if (i < value) t.push('<i class="ico ico--star u-textYellow"></i>');
      else t.push('<i class="ico ico--star"></i>');
    return new Handlebars.SafeString(t.join(''));
  });
  Handlebars.registerHelper('inflection', (count, word) =>
    count === 1 ? word : `${word}s`
  );
  Handlebars.registerHelper('date', e => {
    const dateWithoutTZ = e.split('T')[0];
    const t = new Date(dateWithoutTZ);
    return `${String(t.getMonth() + 1)}/${t.getDate()}/${t
      .getFullYear()
      .toString()
      .substr(2)}`;
  });

  let G = true;
  const breakpoint = 768;

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
    const numSlides = $('.js-slick--products .slick-slide:not(.slick-cloned)');
    const productImages = $('.productImages');
    if ($(window).width() <= breakpoint) {
      productImages.css('margin-left', 0);
    } else {
      if (numSlides.length < 4 && currentIndex === 0)
        productImages.css('margin-left', window.innerWidth / 3);
      else if (numSlides.length === 3 && currentIndex === 2)
        productImages.css('margin-left', -window.innerWidth / 3);
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
      $(window).height() -
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

  const productWrap = $('#ProductWrap');
  const modelCode = productWrap.data('modelCode');
  if (!productWrap.hasClass('product-singleOption'))
    optionToSwatch().then(() => {
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
  $('.js-slick--products').on('afterChange', updateProductSlides);
  $('.selector-wrapper--color .option').on('click', updateProductSlides);
  $('.js-slick--products .productImage').click(updateProductSlides);
  $(window).resize(updateProductSlides);
  if ($(window).width() <= breakpoint)
    $('.productImage.slick-slide img').removeAttr('data-action');
  if ($(window).width() >= l) {
    y();
    $(window).resize(y);
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

  const imageGroups = new ImageGroups().getGroups();
  $(imageGroups).each((index, i) => {
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
    if ($(this).data('color') === imageGroups[0].color) return true;
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
  const initWithModelCode = () => {
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
              if ($(window).width() >= breakpoint) $('#bannerVideo').remove();
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
    const J = `${s}/api/en_US/review/list?site=1132&type=1&locales=en&nb=3&offer=`;
    const productReviewsTemplate = handlebarsSafeCompile(
      $('#productReviewsTemplate').html()
    );
    let q = 0;
    const Q = $('#productAggregateRating').data('reviews');
    window.starsTemplate = handlebarsSafeCompile(
      $('#productAggregateRating').html()
    );

    window.reviewsflushlist = false;
    window.reviewsinitialized = false;

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
    const loadReviews = () => {
      if (window.reviewsflushlist) q = 0;
      const e = ($('.js-productReviewsSort').val() || 'createdAt|desc').split(
        '|'
      );
      const i = 3 * q;
      q++;
      if (!(!Q || i >= Q.total_item_count))
        if (e[0] === 'createdAt' && e[1] === 'desc' && q <= 5)
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
  };
  if (modelCode) {
    initWithModelCode();
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
  const X = /iPhone/.test(navigator.userAgent) && !window.MSStream;
  let Y = false;
  $('.js-sizechart').click(i => {
    i.preventDefault();
    if ($(window).width() < 768)
      $('html, body').css({
        overflow: 'hidden',
        position: 'fixed'
      });
    if (!Y) {
      const n = setInterval(() => {
        if ($('.sizeGuide').html() !== '') {
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
        $('.sizechart .u-centerVertically').removeClass('u-centerVertically');
    }
    $('.sizechart').css('display', 'block');
    $('html').addClass('is-showingSizeChart');
  });
  $('.js-closeSizechart').click(() => {
    if ($(window).width() < 768)
      $('html, body').css({
        overflow: '',
        position: ''
      });

    $('.sizechart').css('display', 'none');
    $('html').removeClass('is-showingSizeChart');
  });
});
