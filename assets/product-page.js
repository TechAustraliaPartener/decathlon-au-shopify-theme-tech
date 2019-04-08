!function() {
    "use strict";
    var IS_ACTIVE_CLASS = "de-is-active";
    var $ = window.jQuery;
    var SELECT_EVENT = "SizeSwatches:select";
    var $SizeSwatches = $(".js-de-SizeSwatches");
    var $SizeSwatchesOptions = $SizeSwatches.find(".js-de-SizeSwatches-option");
    var $SizeInfo = $(".js-de-SizeInfo");
    var $$1 = window.jQuery;
    var $posterImages = $$1(".js-de-slick--videos .vjs-poster");
    var $videoCarousel = $$1(".js-de-slick--videos");
    var $thumbnailCarousel = $$1(".js-de-slick--videos-thumbnails");
    var $toggleButton = $$1(".js-de-watch-video-button");
    var $viewImagesCTA = $$1(".js-de-view-images");
    var $watchVideoCTA = $$1(".js-de-watch-video");
    var $copyVideo = $$1(".js-de-copyVideo");
    $$1(window).on("load", function() {
        $posterImages.each(function(index) {
            $$1(".js-de-slick--videos-thumbnails .js-de-thumb-" + (index + 1)).attr("src", $$1(this).css("background-image").replace(/^url\(['"](.+)['"]\)/, "$1"));
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
        $$1(this).hasClass("js-de-toggle") ? ($$1(this).removeClass("js-de-toggle"), $watchVideoCTA.removeClass("hide"), 
        $viewImagesCTA.addClass("hide"), $copyVideo.addClass("hide")) : ($$1(this).addClass("js-de-toggle"), 
        $viewImagesCTA.removeClass("hide"), $watchVideoCTA.addClass("hide"), $copyVideo.removeClass("hide"));
    }), ($SizeSwatchesOptions.on("click", function() {
        (function() {
            $SizeSwatches.trigger(SELECT_EVENT, {
                value: $(this).val()
            });
        }).call(this), function() {
            (function() {
                $SizeSwatchesOptions.removeClass(IS_ACTIVE_CLASS), $(this).addClass(IS_ACTIVE_CLASS);
            }).call(this), $SizeInfo.text($(this).val());
        }.call(this);
    }), $SizeSwatches).on("SizeSwatches:select", function(e, sizeSwatchesData) {
        console.log("SELECTED:", sizeSwatchesData.value);
    });
}();
