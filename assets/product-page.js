!function($, Handlebars) {
    "use strict";
    $ = $ && $.hasOwnProperty("default") ? $.default : $, Handlebars = Handlebars && Handlebars.hasOwnProperty("default") ? Handlebars.default : Handlebars;
    var IS_ACTIVE_CLASS = "de-is-active";
    var SELECT_EVENT = "ColorSwatches:select";
    var $ColorSwatches = $(".js-de-ColorSwatches");
    var $ColorSwatchesOptions = $ColorSwatches.find(".js-de-ColorSwatches-option");
    var $ColorInfo = $(".js-de-ColorInfo");
    var SELECT_EVENT$1 = "SizeSwatches:select";
    var $SizeSwatches = $(".js-de-SizeSwatches");
    var $SizeSwatchesOptions = $SizeSwatches.find(".js-de-SizeSwatches-option");
    var $SizeInfo = $(".js-de-SizeInfo");
    var $posterImages = $(".js-de-slick--videos .vjs-poster");
    var $videoCarousel = $(".js-de-slick--videos");
    var $thumbnailCarousel = $(".js-de-slick--videos-thumbnails");
    var $toggleButton = $(".js-de-watch-video-button");
    var $viewImagesCTA = $(".js-de-view-images");
    var $watchVideoCTA = $(".js-de-watch-video");
    var $copyVideo = $(".js-de-copyVideo");
    $(window).on("load", function() {
        $posterImages.each(function(index) {
            $(".js-de-slick--videos-thumbnails .js-de-thumb-" + (index + 1)).attr("src", $(this).css("background-image").replace(/^url\(['"](.+)['"]\)/, "$1"));
        }), $videoCarousel.slick({
            asNavFor: $thumbnailCarousel,
            arrows: !1
        }), $thumbnailCarousel.slick({
            slidesToShow: 4,
            slidesToScroll: 1,
            asNavFor: $videoCarousel,
            centerMode: !0,
            focusOnSelect: !0
        });
    }), $toggleButton.click(function() {
        $(this).hasClass("js-de-toggle") ? ($(this).removeClass("js-de-toggle"), $watchVideoCTA.removeClass("hide"), 
        $viewImagesCTA.addClass("hide"), $copyVideo.addClass("hide")) : ($(this).addClass("js-de-toggle"), 
        $viewImagesCTA.removeClass("hide"), $watchVideoCTA.addClass("hide"), $copyVideo.removeClass("hide"));
    });
    var tplEl = document.getElementById("de-ReviewMatrix-template");
    var containerEl = document.getElementById("de-ReviewMatrix-container");
    var voteLinkHandler = function(event) {
        event.preventDefault();
    };
    var arr;
    Handlebars && tplEl && containerEl && function(modelCode) {
        if ("string" != typeof modelCode || "" === modelCode) throw Error("Cannot fetch product data, misssing model code");
        return fetch(function(modelCode) {
            return void 0 === modelCode && (modelCode = ""), "https://reviews.decathlon.com/api/en_US/review/list?site=1132&type=1&locales=en&nb=3&offer=" + modelCode;
        }(modelCode)).then(function(res) {
            return res.json();
        });
    }(tplEl.dataset && tplEl.dataset.modelCode).then(function(productReviewsData) {
        var html = Handlebars.compile(tplEl.innerHTML)({
            ratings: Object.keys(productReviewsData.notes).reverse().map(function(stars) {
                return function(_ref) {
                    var stars = _ref.stars, productReviewsData = _ref.productReviewsData;
                    var starsCount = productReviewsData.notes[stars].count;
                    return {
                        starsFill: 20 * stars,
                        starsCount: starsCount,
                        starsPercentage: starsCount / productReviewsData.total_item_rating_count * 100
                    };
                }({
                    stars: stars,
                    productReviewsData: productReviewsData
                });
            })
        });
        containerEl.innerHTML = html;
    }).catch(function(error) {
        return console.error(error);
    }), (arr = document.querySelectorAll(".js-de-CustomerReviewVote"), function(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
            return arr2;
        }
    }(arr) || function(iter) {
        if (Symbol.iterator in Object(iter) || "[object Arguments]" === Object.prototype.toString.call(iter)) return Array.from(iter);
    }(arr) || function() {
        throw new TypeError("Invalid attempt to spread non-iterable instance");
    }()).forEach(function(link) {
        return link.addEventListener("click", voteLinkHandler);
    }), ($SizeSwatchesOptions.on("click", function() {
        (function() {
            $SizeSwatches.trigger(SELECT_EVENT$1, {
                value: $(this).val()
            });
        }).call(this), function() {
            (function() {
                $SizeSwatchesOptions.removeClass(IS_ACTIVE_CLASS), $(this).addClass(IS_ACTIVE_CLASS);
            }).call(this), $SizeInfo.text($(this).val());
        }.call(this);
    }), $SizeSwatches).on("SizeSwatches:select", function(e, sizeSwatchesData) {
        console.log("SELECTED:", sizeSwatchesData.value);
    }), ($ColorSwatchesOptions.on("click", function() {
        (function() {
            $ColorSwatches.trigger(SELECT_EVENT, {
                value: $(this).val()
            });
        }).call(this), function() {
            (function() {
                $ColorSwatchesOptions.removeClass(IS_ACTIVE_CLASS), $(this).addClass(IS_ACTIVE_CLASS);
            }).call(this), $ColorInfo.text($(this).val());
        }.call(this);
    }), $ColorSwatches).on("ColorSwatches:select", function(e, colorSwatchesData) {
        console.log("SELECTED:", colorSwatchesData.value);
    });
}(jQuery, Handlebars);
