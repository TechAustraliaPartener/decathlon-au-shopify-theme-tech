!function($) {
    "use strict";
    $ = $ && $.hasOwnProperty("default") ? $.default : $;
    var IS_ACTIVE_CLASS = "de-is-active";
    var SELECT_EVENT = "SizeSwatches:select";
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
}(jQuery);
