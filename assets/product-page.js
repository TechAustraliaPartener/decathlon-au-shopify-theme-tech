!function() {
    "use strict";
    var IS_ACTIVE_CLASS = "de-is-active";
    var $ = window.jQuery;
    var SELECT_EVENT = "SizeSwatches:select";
    var $SizeSwatches = $(".js-de-SizeSwatches");
    var $SizeSwatchesOptions = $SizeSwatches.find(".js-de-SizeSwatches-option");
    var $SizeInfo = $(".js-de-SizeInfo");
    var $$1 = window.jQuery;
    $$1(".de-js-slick--videos").slick({
        dots: !0,
        arrows: !1
    }), $$1(".de-js-watch-video-button").click(function() {
        if ($$1(this).hasClass("de-js-toggle")) $$1(this).removeClass("de-js-toggle"), $$1(".de-js-watch-video.hide").removeClass("hide"), 
        $$1(".de-js-view-images").addClass("hide"), $$1(".de-js-copyVideo").remove(); else {
            $$1(this).addClass("de-js-toggle"), $$1(".de-js-view-images.hide").removeClass("hide"), 
            $$1(".de-js-watch-video").addClass("hide");
            var t = $$1(".de-js-firstVideo").clone().removeAttr("height").attr("height", "50%").removeAttr("id").addClass("de-copyVideo").addClass("de-js-copyVideo");
            $$1(".de-js-ProductPhoto").append(t);
        }
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
