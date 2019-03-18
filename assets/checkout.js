!function() {
    "use strict";
    var Shopify = window.Shopify;
    var config = {
        SELECTORS: {
            PREFIX: ".js-de-",
            get CART() {
                return this.PREFIX + "cart";
            },
            get CHECKOUT_INPUT() {
                return this.PREFIX + "checkout";
            },
            get LOGOUT() {
                return this.PREFIX + "logout";
            },
            get CART_COUNT() {
                return this.PREFIX + "cart-count";
            },
            get CUSTOMER_ID() {
                return this.PREFIX + "cid";
            },
            CHECKOUT: {
                STEPS: {
                    CONTACT_INFORMATION: "contact_information",
                    SHIPPING_METHOD: "shipping_method",
                    PAYMENT_METHOD: "payment_method",
                    PROCESSING: "processing",
                    REVIEW: "review"
                },
                get STEP() {
                    return Shopify && Shopify.Checkout && Shopify.Checkout.step;
                },
                get PAGE() {
                    return Shopify && Shopify.Checkout && Shopify.Checkout.page;
                },
                URLS: {
                    ROOT_URL: "/",
                    get CART_URL() {
                        return this.ROOT_URL + "cart";
                    }
                },
                TEXT: {
                    CART_TEXT: "Cart"
                },
                CLASSES: {
                    BREADCRUMBS: {
                        BC_ROOT: "breadcrumb",
                        get PREFIX() {
                            return this.BC_ROOT + "__";
                        },
                        get BC_LINK() {
                            return this.PREFIX + "link";
                        },
                        get BC_ITEM() {
                            return this.PREFIX + "item";
                        },
                        get BC_ITEM_COMPLETED() {
                            return this.BC_ITEM + "--completed";
                        },
                        get BC_CHEVRON_ICON() {
                            return this.PREFIX + "chevron-icon";
                        }
                    },
                    STEPS: {
                        STEP_ROOT: "step",
                        get PREFIX() {
                            return this.STEP_ROOT + "__";
                        },
                        get STEP_FOOTER() {
                            return this.PREFIX + "footer";
                        },
                        get STEP_FOOTER_PREVIOUS_LINK() {
                            return this.STEP_FOOTER + "__previous-link";
                        }
                    },
                    LOGO: "logo"
                },
                ATTRIBUTES: {
                    BREADCRUMBS: {
                        DATA_TREKKIE_ID: {
                            TREKKIE_NAME: "data-trekkie-id",
                            get TREKKIE_VALUE() {
                                return config.SELECTORS.CHECKOUT.CLASSES.BREADCRUMBS.BC_ROOT + "_cart_link";
                            }
                        }
                    }
                }
            }
        },
        STOREFRONT_API: {
            HEADER_NAME: "X-Shopify-Storefront-Access-Token",
            KEY: "f6c7c4e4db56de88295c2ba45762a331"
        },
        NO_CACHE_HEADERS: {
            "cache-control": "no-store",
            pragma: "no-store",
            cache: "no-store"
        }
    };
    var _config$SELECTORS$CHE = config.SELECTORS.CHECKOUT, STEP = _config$SELECTORS$CHE.STEP, STEPS = _config$SELECTORS$CHE.STEPS, PAGE = _config$SELECTORS$CHE.PAGE, CART_TEXT = _config$SELECTORS$CHE.TEXT.CART_TEXT, _config$SELECTORS$CHE2 = _config$SELECTORS$CHE.CLASSES, LOGO = _config$SELECTORS$CHE2.LOGO, _config$SELECTORS$CHE3 = _config$SELECTORS$CHE2.STEPS, STEP_FOOTER = _config$SELECTORS$CHE3.STEP_FOOTER, STEP_FOOTER_PREVIOUS_LINK = _config$SELECTORS$CHE3.STEP_FOOTER_PREVIOUS_LINK, _config$SELECTORS$CHE4 = _config$SELECTORS$CHE2.BREADCRUMBS, BC_ROOT = _config$SELECTORS$CHE4.BC_ROOT, BC_LINK = _config$SELECTORS$CHE4.BC_LINK, BC_ITEM = _config$SELECTORS$CHE4.BC_ITEM, BC_ITEM_COMPLETED = _config$SELECTORS$CHE4.BC_ITEM_COMPLETED, BC_CHEVRON_ICON = _config$SELECTORS$CHE4.BC_CHEVRON_ICON, _config$SELECTORS$CHE5 = _config$SELECTORS$CHE.ATTRIBUTES.BREADCRUMBS.DATA_TREKKIE_ID, TREKKIE_NAME = _config$SELECTORS$CHE5.TREKKIE_NAME, TREKKIE_VALUE = _config$SELECTORS$CHE5.TREKKIE_VALUE, _config$SELECTORS$CHE6 = _config$SELECTORS$CHE.URLS, CART_URL = _config$SELECTORS$CHE6.CART_URL, ROOT_URL = _config$SELECTORS$CHE6.ROOT_URL;
    var buildStepLink = function() {
        var returnToCartLink = document.createElement("a");
        returnToCartLink.href = CART_URL, returnToCartLink.classList.add(STEP_FOOTER_PREVIOUS_LINK), 
        returnToCartLink.innerHTML = '<svg focusable="false" aria-hidden="true" class="icon-svg icon-svg--color-accent icon-svg--size-10 previous-link__icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><path d="M8 1L7 0 3 4 2 5l1 1 4 4 1-1-4-4"></path></svg><span class="step__footer__previous-link-content">Return to cart</span>', 
        document.querySelector("." + STEP_FOOTER).appendChild(returnToCartLink);
    };
    !function() {
        var breadcrumbLinks = document.querySelectorAll("." + BC_LINK);
        for (var _isArray = Array.isArray(_iterator = breadcrumbLinks), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator](); ;) {
            var _ref;
            if (_isArray) {
                if (_i >= _iterator.length) break;
                _ref = _iterator[_i++];
            } else {
                if ((_i = _iterator.next()).done) break;
                _ref = _i.value;
            }
            if (_ref.href.indexOf(CART_URL) > -1) return !0;
        }
        return !1;
    }() && Object.keys(STEPS).some(function(step) {
        return STEPS[step] === STEP;
    }) && (STEP === STEPS.CONTACT_INFORMATION && buildStepLink(), function() {
        var breadcrumbs = document.querySelector("." + BC_ROOT);
        if (breadcrumbs) {
            var cartCrumb = document.createElement("li");
            cartCrumb.classList.add(BC_ITEM, BC_ITEM_COMPLETED);
            var cartCrumbLink = document.createElement("a");
            cartCrumbLink.href = CART_URL, cartCrumbLink.classList.add("" + BC_LINK), cartCrumbLink.appendChild(document.createTextNode(CART_TEXT)), 
            cartCrumbLink.setAttribute(TREKKIE_NAME, TREKKIE_VALUE);
            var cartCrumbArrow = document.querySelector("." + BC_CHEVRON_ICON).cloneNode(!0);
            cartCrumb.appendChild(cartCrumbLink), breadcrumbs.insertBefore(cartCrumb, breadcrumbs.firstChild), 
            cartCrumb.insertBefore(cartCrumbArrow, cartCrumbLink.nextSibling);
        }
    }()), "stock_problems" === PAGE && buildStepLink(), function() {
        var logos = document.querySelectorAll("." + LOGO);
        for (var _isArray2 = Array.isArray(_iterator2 = logos), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator](); ;) {
            var _ref2;
            if (_isArray2) {
                if (_i2 >= _iterator2.length) break;
                _ref2 = _iterator2[_i2++];
            } else {
                if ((_i2 = _iterator2.next()).done) break;
                _ref2 = _i2.value;
            }
            _ref2.href = ROOT_URL;
        }
    }();
}();
