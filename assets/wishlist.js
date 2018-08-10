;(function(window, Cookies, $) {

  /**
   * Wishlist object.
   *
   * @param {Object} ctx
   * @param {Object} ctx.accessKey
   * @param {Object=} ctx.customerId
   * @param {Object=} ctx.productClass
   * @param {Object} ctx.shopName
   * @constructor
   */
  function BLNWishlist(ctx) {
    this.rootUrl_ = 'https://decathlon-wishlist.herokuapp.com';
    this.accessKey_ = ctx.accessKey;
    this.customerId_ = ctx.customerId;
    this.productClass = ctx.productClass || '.js-bln-product';
    this.shopName_ = ctx.shopName.replace(/.myshopify.com/, '-wishlist');

    //this.sync_();
  };

  /**
   * Base XHR call.
   *
   * @param {String} method
   * @param {String} url
   * @returns {Promise}
   */
  BLNWishlist.prototype.call_ = function(method, url) {
    var self = this;
    return $.ajax({
        method: method,
        url: self.rootUrl_ + url,
        headers: {
          'x-access-key': self.accessKey_,
          'x-customer-id': self.customerId_
        }
      });
  };

  /**
   * Checks whether the user is a customer.
   * 
   * @returns {Boolean}
   */
  BLNWishlist.prototype.isCustomer = function() {
    return this.customerId_ ? true : false;
  };


  /**
   * Creates user.
   * 
   * @returns {BLNWishlist}
   */
  BLNWishlist.prototype.setCustomer = function(customerId) {
    this.customerId_ = customerId;
    return this;
  };


  /**
   * Checks that wishlist is active
   *
   * @returns {Promise}
   */
  BLNWishlist.prototype.ping = function() {
    return this.call_('POST', '/ping');
  };

  /**
   * Store wishlist information.
   *
   * @param {Object} data
   * @returns {Promise}
   */
  BLNWishlist.prototype.store = function(data) {
    var self = this,
        data = $.extend({}, data, { customerId: self.customerId_ }),
        cookieData = Cookies.getJSON(self.shopName_) || [],
        itemExists = false;

    $.each(cookieData, function(k, item) {
      var productMatches = data.productId === item.productId,
          variantMatches = data.variantId === item.variantId;

      /*!
       * Added originally from category, updating with variant
       */
      if (productMatches && data.variantId && !item.variantId) {
        cookieData[k] = data;
        itemExists = true;
      }

      /*!
       * Item and variant exists.
       */
      if (productMatches && variantMatches) { 
        itemExists = true; 
      };

    });

    /*!
     * add if the item doesn't exist
     */
    if (!itemExists) { 
      cookieData.push(data); 
    }
    Cookies.set(self.shopName_, cookieData);

    return;

    // if (!self.isCustomer()) {
    //   return Promise.resolve();
    // } 
    // 
    // return self.ping().then(self.call_('/product', data));
  };


  /**
   * Utility for adding a product.
   *
   * @param {Object} data
   * @returns {Promise}
   */
  BLNWishlist.prototype.add = function(data) {
    return this.store(data);
  };

  BLNWishlist.prototype.getWishlist = function() {
    var self = this;
    return Cookies.getJSON(self.shopName_);
  };

  window.BLNWishlist = BLNWishlist;

})(window, Cookies, jQuery);
// vim: set ft=javascript:
