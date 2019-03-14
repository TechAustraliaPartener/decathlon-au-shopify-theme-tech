!function() {
    "use strict";
    var logState = function() {
        console.info("STATE:", STATE);
    };
    var STATE = {
        _deliveryMethod: null,
        _pickupStore: null,
        _checkoutStep: null,
        get deliveryMethod() {
            return this._deliveryMethod;
        },
        get pickupStore() {
            return this._pickupStore;
        },
        get checkoutStep() {
            return this._checkoutStep;
        },
        set deliveryMethod(method) {
            this._deliveryMethod = method, logState();
        },
        set pickupStore(store) {
            this._pickupStore = store, logState();
        },
        set checkoutStep(step) {
            this._checkoutStep = step, logState();
        }
    };
    var hideElement = function(element) {
        element && element.classList.add("de-u-hidden");
    };
    var showElement = function(element) {
        element && element.classList.remove("de-u-hidden");
    };
    var hideElements = function(elements) {
        elements.forEach(hideElement);
    };
    var showElements = function(elements) {
        elements.forEach(showElement);
    };
    function _extends() {
        return (_extends = Object.assign || function(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
            }
            return target;
        }).apply(this, arguments);
    }
    var SELECTORS = _extends({}, {
        CONTINUE_BTN: ".step__footer__continue-btn",
        DELIVERY_INPUTS: {
            addressInput: '[data-address-field="address1"]',
            cityInput: '[data-address-field="city"]',
            countryInput: '[data-address-field="country"]',
            provinceInput: '[data-address-field="province"]',
            zipInput: '[data-address-field="zip"]'
        }
    }, {
        TOGGLE_SHIPPING: ".js-de-toggle-shipping",
        TOGGLE_PICKUP: ".js-de-toggle-pickup",
        PICKUP_CONTENT: ".js-de-pickup-content",
        PICKUP_LOCATIONS: ".js-de-pickup-locations"
    });
    var deliveryElements = Object.keys(SELECTORS.DELIVERY_INPUTS).map(function(key) {
        return document.querySelector(SELECTORS.DELIVERY_INPUTS[key]);
    });
    var continueBtn = document.querySelector(SELECTORS.CONTINUE_BTN);
    var shipToggleBtn = document.querySelector(SELECTORS.TOGGLE_SHIPPING);
    var pickupToggleBtn = document.querySelector(SELECTORS.TOGGLE_PICKUP);
    var pickupContent = document.querySelector(SELECTORS.PICKUP_CONTENT);
    document.querySelectorAll(SELECTORS.STORE_INPUT);
    var pickupLocationList = document.querySelector(SELECTORS.PICKUP_LOCATIONS);
    var updateUI = function() {
        showElements([ shipToggleBtn, pickupToggleBtn ]);
        var deliveryMethod = STATE.deliveryMethod;
        "pickup" === deliveryMethod && (hideElements(deliveryElements), showElements([ pickupContent ]), 
        hideElements([ continueBtn ]), showElements([ document.querySelector(".js-de-payment-continue") ]), 
        pickupToggleBtn.classList.add("js-de-active-pickship-btn"), shipToggleBtn.classList.remove("js-de-active-pickship-btn")), 
        "ship" === deliveryMethod && (shipToggleBtn.classList.add("js-de-active-pickship-btn"), 
        pickupToggleBtn.classList.remove("js-de-active-pickship-btn"), showElements(deliveryElements), 
        hideElements([ pickupContent ]), hideElements([ document.querySelector(".js-de-payment-continue") ]), 
        showElements([ continueBtn ]));
    };
    var js_cookie = (function(module, exports) {
        module.exports = function() {
            function extend() {
                var i = 0;
                var result = {};
                for (;i < arguments.length; i++) {
                    var attributes = arguments[i];
                    for (var key in attributes) result[key] = attributes[key];
                }
                return result;
            }
            return function init(converter) {
                function api(key, value, attributes) {
                    var result;
                    if ("undefined" != typeof document) {
                        if (arguments.length > 1) {
                            if ("number" == typeof (attributes = extend({
                                path: "/"
                            }, api.defaults, attributes)).expires) {
                                var expires = new Date();
                                expires.setMilliseconds(expires.getMilliseconds() + 864e5 * attributes.expires), 
                                attributes.expires = expires;
                            }
                            attributes.expires = attributes.expires ? attributes.expires.toUTCString() : "";
                            try {
                                result = JSON.stringify(value), /^[\{\[]/.test(result) && (value = result);
                            } catch (e) {}
                            value = converter.write ? converter.write(value, key) : encodeURIComponent(value + "").replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent), 
                            key = (key = (key = encodeURIComponent(key + "")).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)).replace(/[\(\)]/g, escape);
                            var stringifiedAttributes = "";
                            for (var attributeName in attributes) attributes[attributeName] && (stringifiedAttributes += "; " + attributeName, 
                            !0 !== attributes[attributeName] && (stringifiedAttributes += "=" + attributes[attributeName]));
                            return document.cookie = key + "=" + value + stringifiedAttributes;
                        }
                        key || (result = {});
                        var cookies = document.cookie ? document.cookie.split("; ") : [];
                        var rdecode = /(%[0-9A-Z]{2})+/g;
                        var i = 0;
                        for (;i < cookies.length; i++) {
                            var parts = cookies[i].split("=");
                            var cookie = parts.slice(1).join("=");
                            this.json || '"' !== cookie.charAt(0) || (cookie = cookie.slice(1, -1));
                            try {
                                var name = parts[0].replace(rdecode, decodeURIComponent);
                                if (cookie = converter.read ? converter.read(cookie, name) : converter(cookie, name) || cookie.replace(rdecode, decodeURIComponent), 
                                this.json) try {
                                    cookie = JSON.parse(cookie);
                                } catch (e) {}
                                if (key === name) {
                                    result = cookie;
                                    break;
                                }
                                key || (result[name] = cookie);
                            } catch (e) {}
                        }
                        return result;
                    }
                }
                return api.set = api, api.get = function(key) {
                    return api.call(api, key);
                }, api.getJSON = function() {
                    return api.apply({
                        json: !0
                    }, [].slice.call(arguments));
                }, api.defaults = {}, api.remove = function(key, attributes) {
                    api(key, "", extend(attributes, {
                        expires: -1
                    }));
                }, api.withConverter = init, api;
            }(function() {});
        }();
    }(module = {
        exports: {}
    }), module.exports);
    var module;
    var test;
    !function(type) {
        var storage;
        try {
            storage = window.localStorage;
            var x = "__storage_test__";
            storage.setItem(x, x), storage.removeItem(x);
        } catch (error) {
            return error instanceof DOMException && (22 === error.code || 1014 === error.code || "QuotaExceededError" === error.name || "NS_ERROR_DOM_QUOTA_REACHED" === error.name) && 0 !== storage.length;
        }
    }(), js_cookie.set(test = "persistent-cart-test", "foo"), js_cookie.get(test), js_cookie.remove(test), 
    js_cookie.get(test);
    var setObjectInLocalStorage = function(name, value) {
        return localStorage.setItem(name, JSON.stringify(value));
    };
    var getObjectFromLocalStorage = function(name) {
        return JSON.parse(localStorage.getItem(name));
    };
    var contactInformation_updateUI = updateUI;
    var Shopify$1 = window.Shopify;
    var config = {
        SELECTORS: {
            PREFIX: ".js-de-",
            get CART() {
                return this.PREFIX + "cart";
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
                get STEP() {
                    return Shopify$1 && Shopify$1.Checkout && Shopify$1.Checkout.step;
                },
                get PAGE() {
                    return Shopify$1 && Shopify$1.Checkout && Shopify$1.Checkout.page;
                },
                get IS_CONTACT_INFO_STEP() {
                    return "contact_information" === this.STEP;
                },
                get IS_STOCK_PROBLEMS_PAGE() {
                    return "stock_problems" === this.PAGE;
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
            KEY: void 0
        }
    };
    var _config$SELECTORS$CHE = config.SELECTORS.CHECKOUT, IS_CONTACT_INFO_STEP = _config$SELECTORS$CHE.IS_CONTACT_INFO_STEP, IS_STOCK_PROBLEMS_PAGE = _config$SELECTORS$CHE.IS_STOCK_PROBLEMS_PAGE, CART_TEXT = _config$SELECTORS$CHE.TEXT.CART_TEXT, _config$SELECTORS$CHE2 = _config$SELECTORS$CHE.CLASSES, LOGO = _config$SELECTORS$CHE2.LOGO, _config$SELECTORS$CHE3 = _config$SELECTORS$CHE2.STEPS, STEP_FOOTER = _config$SELECTORS$CHE3.STEP_FOOTER, STEP_FOOTER_PREVIOUS_LINK = _config$SELECTORS$CHE3.STEP_FOOTER_PREVIOUS_LINK, _config$SELECTORS$CHE4 = _config$SELECTORS$CHE2.BREADCRUMBS, BC_ROOT = _config$SELECTORS$CHE4.BC_ROOT, BC_LINK = _config$SELECTORS$CHE4.BC_LINK, BC_ITEM = _config$SELECTORS$CHE4.BC_ITEM, BC_ITEM_COMPLETED = _config$SELECTORS$CHE4.BC_ITEM_COMPLETED, BC_CHEVRON_ICON = _config$SELECTORS$CHE4.BC_CHEVRON_ICON, _config$SELECTORS$CHE5 = _config$SELECTORS$CHE.ATTRIBUTES.BREADCRUMBS.DATA_TREKKIE_ID, TREKKIE_NAME = _config$SELECTORS$CHE5.TREKKIE_NAME, TREKKIE_VALUE = _config$SELECTORS$CHE5.TREKKIE_VALUE, _config$SELECTORS$CHE6 = _config$SELECTORS$CHE.URLS, CART_URL = _config$SELECTORS$CHE6.CART_URL, ROOT_URL = _config$SELECTORS$CHE6.ROOT_URL;
    document.addEventListener("page:load", function() {
        STATE.deliveryMethod = "pickup" === getObjectFromLocalStorage("delivery_method") ? "pickup" : "ship", 
        getObjectFromLocalStorage("pickup_store") && (STATE.pickupStore = getObjectFromLocalStorage("pickup_store")), 
        STATE.checkoutStep = Shopify && Shopify.Checkout && Shopify.Checkout.step, "contact_information" === STATE.checkoutStep && function() {
            pickupToggleBtn.addEventListener("click", function(event) {
                STATE.deliveryMethod = "pickup", pickupToggleBtn.classList.toggle("js-de-active-pickship-btn"), 
                shipToggleBtn.classList.toggle("js-de-active-pickship-btn"), setObjectInLocalStorage("delivery_method", "pickup"), 
                updateUI();
            }), shipToggleBtn.addEventListener("click", function(event) {
                STATE.deliveryMethod = "ship", pickupToggleBtn.classList.toggle("js-de-active-pickship-btn"), 
                shipToggleBtn.classList.toggle("js-de-active-pickship-btn"), setObjectInLocalStorage("delivery_method", "ship"), 
                updateUI();
            }), fetch("https://decathlon-proxy.herokuapp.com/api/shiphawk").then(function(res) {
                return res.json();
            }).then(function(data) {
                !function(locations) {
                    for (var _isArray = Array.isArray(_iterator = data.data), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator](); ;) {
                        var _ref;
                        if (_isArray) {
                            if (_i >= _iterator.length) break;
                            _ref = _iterator[_i++];
                        } else {
                            if ((_i = _iterator.next()).done) break;
                            _ref = _i.value;
                        }
                        var location = _ref;
                        var activeCard = !1;
                        location.id === STATE.pickupStore && (activeCard = !0);
                        var locationNode = document.createElement("li");
                        locationNode.innerHTML = '<div class="js-de-pickup-location de-pickup-location' + (activeCard ? " js-de-active-location" : "") + '" data-id="' + location.id + '">\n      <span class="de-pickup-location-name">' + location.name + "</span>\n      <span>" + location.street1 + " " + (null === location.street2 ? "" : location.street2) + "</span>\n      <span>" + location.city + ", " + location.state + " " + location.zip + '</span>\n      <span class="de-pickup-location-hours">9:00 AM - 8:00 PM | Mon-Sun</span>\n    </div>', 
                        pickupLocationList.appendChild(locationNode);
                    }
                    document.querySelectorAll(".js-de-pickup-location").forEach(function(location) {
                        location.addEventListener("click", function(e) {
                            if (this.classList.contains("js-de-active-location")) console.log("already active"); else {
                                var activeLocation = document.querySelector(".js-de-active-location");
                                null !== activeLocation && activeLocation.classList.remove("js-de-active-location"), 
                                this.classList.add("js-de-active-location");
                                var pickupStore = this.getAttribute("data-id");
                                STATE.pickupStore = pickupStore, setObjectInLocalStorage("pickup_store", pickupStore), 
                                document.querySelector(".js-de-pickup-location-map-img").src = "//cdn.shopify.com/s/files/1/1752/4727/t/79/assets/" + pickupStore + ".jpg?v=2";
                            }
                        });
                    });
                }();
            }), null !== STATE.pickupStore && (document.querySelector(".js-de-pickup-location-map-img").src = "//cdn.shopify.com/s/files/1/1752/4727/t/79/assets/" + STATE.pickupStore + ".jpg?v=2");
            var paymentBtnCont = document.querySelector(".js-de-payment-continue-container");
            var paymentBtn = document.querySelector(".js-de-payment-continue");
            var paymentBtnHTML = paymentBtnCont.innerHTML;
            paymentBtnCont.removeChild(paymentBtn), continueBtn.insertAdjacentHTML("afterend", paymentBtnHTML), 
            (paymentBtn = document.querySelector(".js-de-payment-continue")).addEventListener("click", function(e) {
                e.preventDefault();
            });
        }(), function() {
            "contact_information" === STATE.checkoutStep && contactInformation_updateUI();
            var buildStepLink = function() {
                var returnToCartLink = document.createElement("a");
                returnToCartLink.href = CART_URL, returnToCartLink.classList.add(STEP_FOOTER_PREVIOUS_LINK), 
                returnToCartLink.innerHTML = '<svg focusable="false" aria-hidden="true" class="icon-svg icon-svg--color-accent icon-svg--size-10 previous-link__icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><path d="M8 1L7 0 3 4 2 5l1 1 4 4 1-1-4-4"></path></svg><span class="step__footer__previous-link-content">Return to cart</span>', 
                document.querySelector("." + STEP_FOOTER).appendChild(returnToCartLink);
            };
            if (!function() {
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
            }()) {
                IS_CONTACT_INFO_STEP && buildStepLink(), function() {
                    var breadcrumbs = document.querySelector("." + BC_ROOT);
                    var cartCrumb = document.createElement("li");
                    cartCrumb.classList.add(BC_ITEM, BC_ITEM_COMPLETED);
                    var cartCrumbLink = document.createElement("a");
                    cartCrumbLink.href = CART_URL, cartCrumbLink.classList.add("" + BC_LINK), cartCrumbLink.appendChild(document.createTextNode(CART_TEXT)), 
                    cartCrumbLink.setAttribute(TREKKIE_NAME, TREKKIE_VALUE);
                    var cartCrumbArrow = document.querySelector("." + BC_CHEVRON_ICON).cloneNode(!0);
                    cartCrumb.appendChild(cartCrumbLink), breadcrumbs.insertBefore(cartCrumb, breadcrumbs.firstChild), 
                    cartCrumb.insertBefore(cartCrumbArrow, cartCrumbLink.nextSibling);
                }();
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
            }
            IS_STOCK_PROBLEMS_PAGE && buildStepLink();
        }();
    });
}();
