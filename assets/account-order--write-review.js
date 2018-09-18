! function(e, t, i, n) {
    t(".account-order--js-writeReviewForm").click(function(e) {
      var M = '',
          P = '',
          s = '//reviews.decathlon.com';
      var reviewTitle = 'Write a review for ' + $(this).attr('review-productName');
      var reviewModelCode = $(this).attr('review-modelCode');
      if (e.preventDefault(), !t(".writeReview").length) {
        var i = n.compile(t("#writeReviewTemplate").html());
        t("body").append(i({
            REVIEWS_ROOT: s,
            siteCode: 1132,
            modelCode: M,
            productName: P,
            token: t(".js-account-review-products").data("jwtToken")
        })), 
          t(".inputWrap > select").on("change", function() {}),
          t(".inputWrap > input, .inputWrap > textarea").on("keyup", function() {}),
            t(".js-closeWriteReview").click(function(e) {
                t(".writeReview form").get(0).reset(), t(".writeReview").css("display", "none")
          }),
          console.log(`t(this).attr("action") before POST: ${t(this).attr("action")}`)
          t(".writeReview form").submit(function(e) {
                e.preventDefault();
                var i = t(this);
                t.post(i.attr("action"), i.serialize(), function(e, i) {
                "success" == i ? (t(".writeReview-wrapper").hide(), t(".writeReview-wrapper--after").show() ): console.log(i, e);
                t(".js-closeWriteReview--after").click(function(e) {
                  t(".writeReview form").get(0).reset(), t(".writeReview").css("display", "none"), t(".writeReview-wrapper--after").css("display", "none")
                })
              })
          })
        }
      else {
        t(".writeReview-wrapper").show()
      }
      t("input[name='offerReference']").val(reviewModelCode);
      t(".writeReview-wrapper > h5").text(reviewTitle);
        t(".writeReview").css("display", "block")
  })
  }(window, jQuery, BlueLikeNeon, Handlebars);