!function() {
    "use strict";
    var $ = window.jQuery;
    $(".de-js-slick--videos").slick({
        dots: !0,
        arrows: !1
    }), $(".de-js-watch-video-button").click(function() {
        if ($(this).hasClass("de-js-toggle")) $(this).removeClass("de-js-toggle"), $(".de-js-watch-video.hide").removeClass("hide"), 
        $(".de-js-view-images").addClass("hide"), $(".de-js-copyVideo").remove(); else {
            $(this).addClass("de-js-toggle"), $(".de-js-view-images.hide").removeClass("hide"), 
            $(".de-js-watch-video").addClass("hide");
            var t = $(".de-js-firstVideo").clone().removeAttr("height").attr("height", "50%").removeAttr("id").addClass("de-copyVideo").addClass("de-js-copyVideo");
            $(".de-js-ProductPhoto").append(t);
        }
    });
}();
