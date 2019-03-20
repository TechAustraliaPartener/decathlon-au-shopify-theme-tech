!function() {
    "use strict";
    function _extends() {
        return (_extends = Object.assign || function(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
            }
            return target;
        }).apply(this, arguments);
    }
    function _taggedTemplateLiteralLoose(strings, raw) {
        return raw || (raw = strings.slice(0)), strings.raw = raw, strings;
    }
    function _toConsumableArray(arr) {
        return function(arr) {
            if (Array.isArray(arr)) {
                for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
                return arr2;
            }
        }(arr) || function(iter) {
            if (Symbol.iterator in Object(iter) || "[object Arguments]" === Object.prototype.toString.call(iter)) return Array.from(iter);
        }(arr) || function() {
            throw new TypeError("Invalid attempt to spread non-iterable instance");
        }();
    }
    var getOpname = /(query|mutation) ?([\w\d-_]+)? ?\(.*?\)? \{/;
    function nanographql(str) {
        var _str = Array.isArray(str) ? str.join("") : str;
        var name = getOpname.exec(_str);
        return function(variables) {
            var data = {
                query: _str
            };
            return variables && (data.variables = variables), Array.isArray(name) && name[2] && name[2] && (data.operationName = name[2]), 
            JSON.stringify(data);
        };
    }
    var PRODUCTION_DOMAINS = [ "www.decathlon.com" ];
    var STAGING_DOMAINS = [ "testing-decathlon-usa.myshopify.com" ];
    var config = {
        get API_URL() {
            var hostname = window.location.hostname;
            return STAGING_DOMAINS.some(function(domain) {
                return hostname.match(RegExp(domain));
            }), PRODUCTION_DOMAINS.some(function(domain) {
                return hostname.match(RegExp(domain));
            }), "https://persistent-cart-decathlonusa-p.herokuapp.com/shopify/graphql";
        },
        STORAGE: {
            PREFIX: "de_pc_",
            get SHOPIFY_CART() {
                return this.PREFIX + "shopify_cart";
            },
            get LOGGED_IN() {
                return this.PREFIX + "logged_in";
            }
        },
        SHOPIFY_API: {
            GET_CART: "/cart.js",
            UPDATE_CART: "/cart/update.js"
        },
        COOKIES: {
            CART: "cart",
            CART_TS: "cart_ts",
            CART_SIG: "cart_sig",
            CART_CURRENCY: "cart_currency"
        },
        get ALL_CART_COOKIES() {
            var _this = this;
            return Object.keys(this.COOKIES).map(function(key) {
                return _this.COOKIES[key];
            });
        },
        get CART_COOKIE() {
            return this.COOKIES.CART;
        }
    };
    var Shopify = window.Shopify;
    var config$1 = {
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
                                return config$1.SELECTORS.CHECKOUT.CLASSES.BREADCRUMBS.BC_ROOT + "_cart_link";
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
    function fetch$1(e, n) {
        return n = n || {}, new Promise(function(t, r) {
            var s = new XMLHttpRequest();
            for (var o in s.open(n.method || "get", e, !0), n.headers) s.setRequestHeader(o, n.headers[o]);
            function u() {
                var e, n = [], t = [], r = {};
                return s.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm, function(s, o, u) {
                    n.push(o = o.toLowerCase()), t.push([ o, u ]), r[o] = (e = r[o]) ? e + "," + u : u;
                }), {
                    ok: 2 == (s.status / 100 | 0),
                    status: s.status,
                    statusText: s.statusText,
                    url: s.responseURL,
                    clone: u,
                    text: function() {
                        return Promise.resolve(s.responseText);
                    },
                    json: function() {
                        return Promise.resolve(s.responseText).then(JSON.parse);
                    },
                    blob: function() {
                        return Promise.resolve(new Blob([ s.response ]));
                    },
                    headers: {
                        keys: function() {
                            return n;
                        },
                        entries: function() {
                            return t;
                        },
                        get: function(e) {
                            return r[e.toLowerCase()];
                        },
                        has: function(e) {
                            return e.toLowerCase() in r;
                        }
                    }
                };
            }
            s.withCredentials = "include" == n.credentials, s.onload = function() {
                t(u());
            }, s.onerror = r, s.send(n.body || null);
        });
    }
    var STOREFRONT_API = config$1.STOREFRONT_API, NO_CACHE_HEADERS = config$1.NO_CACHE_HEADERS;
    var makeUncachedRequest = function(query, data, url, extraConfig) {
        return void 0 === extraConfig && (extraConfig = {}), function(query, data, url, extraConfig) {
            return void 0 === extraConfig && (extraConfig = {}), fetch$1(url || config.API_URL, {
                body: query(data),
                method: "POST",
                headers: _extends({
                    "Content-Type": "application/json",
                    Accept: "application/json"
                }, extraConfig.headers)
            }).then(function(response) {
                return response.json();
            }).then(function(_ref) {
                var data = _ref.data, errors = _ref.errors;
                if (errors) {
                    var messages = errors.reduce(function(acc, err, idx) {
                        return acc + (idx > 0 ? ", " : "") + err.message;
                    }, "");
                    console.info("PC: ", messages);
                }
                return data;
            });
        }(query, data, url, {
            headers: _extends({}, NO_CACHE_HEADERS, extraConfig.headers)
        });
    };
    function _templateObject2() {
        var data = _taggedTemplateLiteralLoose([ "\n  query($customerID: ID!) {\n    getCustomer(customerID: $customerID) {\n      customerID\n      cart\n      cartID\n    }\n  }\n" ]);
        return _templateObject2 = function() {
            return data;
        }, data;
    }
    function _templateObject() {
        var data = _taggedTemplateLiteralLoose([ "\n  mutation($customerID: ID!, $cart: JSON) {\n    createOrUpdateCustomer(customerID: $customerID, cart: $cart) {\n      customerID\n      cart\n      cartID\n    }\n  }\n" ]);
        return _templateObject = function() {
            return data;
        }, data;
    }
    var API_URL = config.API_URL;
    var createOrUpdateCustomerMutation = nanographql(_templateObject());
    var getCustomerQuery = nanographql(_templateObject2());
    var createOrUpdateCustomer = function(_ref3) {
        return makeUncachedRequest((_ref = {
            mutation: createOrUpdateCustomerMutation,
            customerID: _ref3.customerID,
            cart: _ref3.cart
        }).mutation, {
            customerID: _ref.customerID,
            cart: _ref.cart
        }, API_URL).then(function(data) {
            return data.createOrUpdateCustomer;
        }).catch(function(error) {
            throw Error("Error creating or updating customer in database: " + error.message);
        });
        var _ref;
    };
    var commonjsGlobal = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};
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
    var localStorageAvailable = function(type) {
        var storage;
        try {
            storage = window.localStorage;
            var x = "__storage_test__";
            return storage.setItem(x, x), storage.removeItem(x), !0;
        } catch (error) {
            return error instanceof DOMException && (22 === error.code || 1014 === error.code || "QuotaExceededError" === error.name || "NS_ERROR_DOM_QUOTA_REACHED" === error.name) && 0 !== storage.length;
        }
    }();
    var cookiesAvailable = function() {
        var test = "persistent-cart-test";
        js_cookie.set(test, "foo");
        var storedVal = js_cookie.get(test);
        js_cookie.remove(test);
        var deletedVal = js_cookie.get(test);
        return storedVal && !deletedVal;
    }();
    var setObjectInLocalStorage = function(name, value) {
        return localStorage.setItem(name, JSON.stringify(value));
    };
    var getObjectFromLocalStorage = function(name) {
        return JSON.parse(localStorage.getItem(name));
    };
    var removeItemFromLocalStorage = function(item) {
        return localStorage.removeItem(item);
    };
    var _config$STORAGE = config.STORAGE, LOGGED_IN = _config$STORAGE.LOGGED_IN, SHOPIFY_CART = _config$STORAGE.SHOPIFY_CART;
    var getStoredShopifyCart = function() {
        return getObjectFromLocalStorage(SHOPIFY_CART);
    };
    var setStoredShopifyCart = function(value) {
        return setObjectInLocalStorage(SHOPIFY_CART, value);
    };
    var removeStoredShopifyCart = function() {
        return removeItemFromLocalStorage(SHOPIFY_CART);
    };
    var setWasLoggedIn = function() {
        return setObjectInLocalStorage(LOGGED_IN, !0);
    };
    var getWasLoggedIn = function() {
        return !!getObjectFromLocalStorage(LOGGED_IN);
    };
    var cache = {
        customerID: null,
        customer: null,
        masterShopifyCart: null,
        customerCartExpired: !1,
        currentCartCount: 0,
        setNewCustomerOrCart: !1
    };
    var getLineItems = function(cart) {
        return (cart && (cart.items || cart.line_items) || []).map(function(_ref) {
            return {
                id: _ref.variant_id,
                quantity: _ref.quantity
            };
        });
    };
    function finallyConstructor(callback) {
        var constructor = this.constructor;
        return this.then(function(value) {
            return constructor.resolve(callback()).then(function() {
                return value;
            });
        }, function(reason) {
            return constructor.resolve(callback()).then(function() {
                return constructor.reject(reason);
            });
        });
    }
    var setTimeoutFunc = setTimeout;
    function noop() {}
    function Promise$1(fn) {
        if (!(this instanceof Promise$1)) throw new TypeError("Promises must be constructed via new");
        if ("function" != typeof fn) throw new TypeError("not a function");
        this._state = 0, this._handled = !1, this._value = void 0, this._deferreds = [], 
        doResolve(fn, this);
    }
    function handle(self, deferred) {
        for (;3 === self._state; ) self = self._value;
        0 !== self._state ? (self._handled = !0, Promise$1._immediateFn(function() {
            var cb = 1 === self._state ? deferred.onFulfilled : deferred.onRejected;
            if (null !== cb) {
                var ret;
                try {
                    ret = cb(self._value);
                } catch (e) {
                    return void reject(deferred.promise, e);
                }
                resolve(deferred.promise, ret);
            } else (1 === self._state ? resolve : reject)(deferred.promise, self._value);
        })) : self._deferreds.push(deferred);
    }
    function resolve(self, newValue) {
        try {
            if (newValue === self) throw new TypeError("A promise cannot be resolved with itself.");
            if (newValue && ("object" == typeof newValue || "function" == typeof newValue)) {
                var then = newValue.then;
                if (newValue instanceof Promise$1) return self._state = 3, self._value = newValue, 
                void finale(self);
                if ("function" == typeof then) return void doResolve((fn = then, thisArg = newValue, 
                function() {
                    fn.apply(thisArg, arguments);
                }), self);
            }
            self._state = 1, self._value = newValue, finale(self);
        } catch (e) {
            reject(self, e);
        }
        var fn, thisArg;
    }
    function reject(self, newValue) {
        self._state = 2, self._value = newValue, finale(self);
    }
    function finale(self) {
        2 === self._state && 0 === self._deferreds.length && Promise$1._immediateFn(function() {
            self._handled || Promise$1._unhandledRejectionFn(self._value);
        });
        for (var i = 0, len = self._deferreds.length; i < len; i++) handle(self, self._deferreds[i]);
        self._deferreds = null;
    }
    function Handler(onFulfilled, onRejected, promise) {
        this.onFulfilled = "function" == typeof onFulfilled ? onFulfilled : null, this.onRejected = "function" == typeof onRejected ? onRejected : null, 
        this.promise = promise;
    }
    function doResolve(fn, self) {
        var done = !1;
        try {
            fn(function(value) {
                done || (done = !0, resolve(self, value));
            }, function(reason) {
                done || (done = !0, reject(self, reason));
            });
        } catch (ex) {
            if (done) return;
            done = !0, reject(self, ex);
        }
    }
    Promise$1.prototype.catch = function(onRejected) {
        return this.then(null, onRejected);
    }, Promise$1.prototype.then = function(onFulfilled, onRejected) {
        var prom = new this.constructor(noop);
        return handle(this, new Handler(onFulfilled, onRejected, prom)), prom;
    }, Promise$1.prototype.finally = finallyConstructor, Promise$1.all = function(arr) {
        return new Promise$1(function(resolve, reject) {
            if (!arr || void 0 === arr.length) throw new TypeError("Promise.all accepts an array");
            var args = Array.prototype.slice.call(arr);
            if (0 === args.length) return resolve([]);
            var remaining = args.length;
            function res(i, val) {
                try {
                    if (val && ("object" == typeof val || "function" == typeof val)) {
                        var then = val.then;
                        if ("function" == typeof then) return void then.call(val, function(val) {
                            res(i, val);
                        }, reject);
                    }
                    args[i] = val, 0 == --remaining && resolve(args);
                } catch (ex) {
                    reject(ex);
                }
            }
            for (var i = 0; i < args.length; i++) res(i, args[i]);
        });
    }, Promise$1.resolve = function(value) {
        return value && "object" == typeof value && value.constructor === Promise$1 ? value : new Promise$1(function(resolve) {
            resolve(value);
        });
    }, Promise$1.reject = function(value) {
        return new Promise$1(function(resolve, reject) {
            reject(value);
        });
    }, Promise$1.race = function(values) {
        return new Promise$1(function(resolve, reject) {
            for (var i = 0, len = values.length; i < len; i++) values[i].then(resolve, reject);
        });
    }, Promise$1._immediateFn = "function" == typeof setImmediate && function(fn) {
        setImmediate(fn);
    } || function(fn) {
        setTimeoutFunc(fn, 0);
    }, Promise$1._unhandledRejectionFn = function(err) {
        void 0 !== console && console && console.warn("Possible Unhandled Promise Rejection:", err);
    };
    var globalNS = function() {
        if ("undefined" != typeof self) return self;
        if ("undefined" != typeof window) return window;
        if ("undefined" != typeof global) return global;
        throw Error("unable to locate global object");
    }();
    "Promise" in globalNS ? globalNS.Promise.prototype.finally || (globalNS.Promise.prototype.finally = finallyConstructor) : globalNS.Promise = Promise$1;
    var CART_COOKIE = config.CART_COOKIE;
    var setCartCookie = function(cartId) {
        return js_cookie.set(CART_COOKIE, cartId);
    };
    var getCartCookie = js_cookie.get(CART_COOKIE);
    var removeCartCookie = function() {
        return js_cookie.remove(CART_COOKIE);
    };
    var objectProto = Object.prototype;
    var funcToString = Function.prototype.toString;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var objectCtorString = funcToString.call(Object);
    var objectToString = objectProto.toString;
    var getPrototype = (func = Object.getPrototypeOf, transform = Object, function(arg) {
        return func(transform(arg));
    });
    var func, transform;
    var updateCartUI = function(count) {
        var el = document.querySelector(".js-cart-count");
        el && (el.innerText = count);
    };
    var LOGOUT = config$1.SELECTORS.LOGOUT;
    var logoutHandler = function() {
        removeCartCookie();
    };
    function _templateObject$1() {
        var data = _taggedTemplateLiteralLoose([ "\n  mutation checkoutCreate($input: CheckoutCreateInput!) {\n    checkoutCreate(input: $input) {\n      checkout {\n        id\n        webUrl\n      }\n      checkoutUserErrors {\n        code\n        field\n        message\n      }\n    }\n  }\n" ]);
        return _templateObject$1 = function() {
            return data;
        }, data;
    }
    var createCheckoutMutation = nanographql(_templateObject$1());
    var createCheckout = function(input) {
        return (query = (_ref = {
            mutation: createCheckoutMutation,
            input: input
        }).mutation, data = {
            input: _ref.input
        }, headers = {}, headers[STOREFRONT_API.HEADER_NAME] = STOREFRONT_API.KEY, makeUncachedRequest(query, data, "/api/graphql", {
            headers: headers
        })).then(function(data) {
            return data.checkoutCreate;
        }).catch(function(error) {
            throw Error("Error getting customer from database: " + error.message);
        });
        var _ref, query, data, headers;
    };
    !function() {
        var k;
        function l(a) {
            var b = 0;
            return function() {
                return b < a.length ? {
                    done: !1,
                    value: a[b++]
                } : {
                    done: !0
                };
            };
        }
        var m = "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, d) {
            a != Array.prototype && a != Object.prototype && (a[b] = d.value);
        }, n = "undefined" != typeof window && window === this ? this : void 0 !== commonjsGlobal && null != commonjsGlobal ? commonjsGlobal : this;
        function p() {
            p = function() {}, n.Symbol || (n.Symbol = r);
        }
        var r = (a = 0, function(b) {
            return "jscomp_symbol_" + (b || "") + a++;
        });
        var a;
        function u() {
            p();
            var a = n.Symbol.iterator;
            a || (a = n.Symbol.iterator = n.Symbol("iterator")), "function" != typeof Array.prototype[a] && m(Array.prototype, a, {
                configurable: !0,
                writable: !0,
                value: function() {
                    return a = l(this), u(), (a = {
                        next: a
                    })[n.Symbol.iterator] = function() {
                        return this;
                    }, a;
                    var a;
                }
            }), u = function() {};
        }
        function x(a) {
            var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
            return b ? b.call(a) : {
                next: l(a)
            };
        }
        var y;
        if ("function" == typeof Object.setPrototypeOf) y = Object.setPrototypeOf; else {
            var z;
            a: {
                var B = {};
                try {
                    B.__proto__ = {
                        o: !0
                    }, z = B.o;
                    break a;
                } catch (a) {}
                z = !1;
            }
            y = z ? function(a, b) {
                if (a.__proto__ = b, a.__proto__ !== b) throw new TypeError(a + " is not extensible");
                return a;
            } : null;
        }
        var C = y;
        function D() {
            this.g = !1, this.c = null, this.m = void 0, this.b = 1, this.l = this.s = 0, this.f = null;
        }
        function E(a) {
            if (a.g) throw new TypeError("Generator is already running");
            a.g = !0;
        }
        function F(a, b, d) {
            return a.b = d, {
                value: b
            };
        }
        function G(a) {
            for (var b in this.w = a, this.j = [], a) this.j.push(b);
            this.j.reverse();
        }
        function H(a) {
            this.a = new D(), this.A = a;
        }
        function I(a, b, d, c) {
            try {
                var e = b.call(a.a.c, d);
                if (!(e instanceof Object)) throw new TypeError("Iterator result " + e + " is not an object");
                if (!e.done) return a.a.g = !1, e;
                var f = e.value;
            } catch (g) {
                return a.a.c = null, a.a.i(g), J(a);
            }
            return a.a.c = null, c.call(a.a, f), J(a);
        }
        function J(a) {
            for (;a.a.b; ) try {
                var b = a.A(a.a);
                if (b) return a.a.g = !1, {
                    value: b.value,
                    done: !1
                };
            } catch (d) {
                a.a.m = void 0, a.a.i(d);
            }
            if (a.a.g = !1, a.a.f) {
                if (b = a.a.f, a.a.f = null, b.v) throw b.u;
                return {
                    value: b.return,
                    done: !0
                };
            }
            return {
                value: void 0,
                done: !0
            };
        }
        function L(a) {
            this.next = function(b) {
                return a.h(b);
            }, this.throw = function(b) {
                return a.i(b);
            }, this.return = function(b) {
                return function(a, b) {
                    E(a.a);
                    var d = a.a.c;
                    return d ? I(a, "return" in d ? d.return : function(a) {
                        return {
                            value: a,
                            done: !0
                        };
                    }, b, a.a.return) : (a.a.return(b), J(a));
                }(a, b);
            }, u(), this[Symbol.iterator] = function() {
                return this;
            };
        }
        function M(a, b) {
            var d = new L(new H(b));
            return C && C(d, a.prototype), d;
        }
        if (D.prototype.h = function(a) {
            this.m = a;
        }, D.prototype.i = function(a) {
            this.f = {
                u: a,
                v: !0
            }, this.b = this.s || this.l;
        }, D.prototype.return = function(a) {
            this.f = {
                return: a
            }, this.b = this.l;
        }, H.prototype.h = function(a) {
            return E(this.a), this.a.c ? I(this, this.a.c.next, a, this.a.h) : (this.a.h(a), 
            J(this));
        }, H.prototype.i = function(a) {
            return E(this.a), this.a.c ? I(this, this.a.c.throw, a, this.a.h) : (this.a.i(a), 
            J(this));
        }, "undefined" == typeof FormData || !FormData.prototype.keys) {
            var N = function(a, b) {
                for (var d = 0; d < a.length; d++) b(a[d]);
            }, P = function(a, b, d) {
                if (2 > arguments.length) throw new TypeError("2 arguments required, but only " + arguments.length + " present.");
                return b instanceof Blob ? [ a + "", b, void 0 !== d ? d + "" : "string" == typeof b.name ? b.name : "blob" ] : [ a + "", b + "" ];
            }, Q = function(a) {
                if (!arguments.length) throw new TypeError("1 argument required, but only 0 present.");
                return [ a + "" ];
            }, R = function(a) {
                var b = x(a);
                return a = b.next().value, b = b.next().value, a instanceof Blob && (a = new File([ a ], b, {
                    type: a.type,
                    lastModified: a.lastModified
                })), a;
            }, S = "object" == typeof window ? window : "object" == typeof self ? self : this, T = S.FormData, U = S.XMLHttpRequest && S.XMLHttpRequest.prototype.send, V = S.Request && S.fetch;
            p();
            var W = S.Symbol && Symbol.toStringTag, X = new WeakMap(), Y = Array.from || function(a) {
                return [].slice.call(a);
            };
            W && (Blob.prototype[W] || (Blob.prototype[W] = "Blob"), "File" in S && !File.prototype[W] && (File.prototype[W] = "File"));
            try {
                new File([], "");
            } catch (a) {
                S.File = function(b, d, c) {
                    return b = new Blob(b, c), Object.defineProperties(b, {
                        name: {
                            value: d
                        },
                        lastModifiedDate: {
                            value: c = c && void 0 !== c.lastModified ? new Date(c.lastModified) : new Date()
                        },
                        lastModified: {
                            value: +c
                        },
                        toString: {
                            value: function() {
                                return "[object File]";
                            }
                        }
                    }), W && Object.defineProperty(b, W, {
                        value: "File"
                    }), b;
                };
            }
            p(), u();
            var Z = function(a) {
                if (X.set(this, Object.create(null)), !a) return this;
                var b = this;
                N(a.elements, function(a) {
                    if (a.name && !a.disabled && "submit" !== a.type && "button" !== a.type) if ("file" === a.type) N(a.files || [], function(c) {
                        b.append(a.name, c);
                    }); else if ("select-multiple" === a.type || "select-one" === a.type) N(a.options, function(c) {
                        !c.disabled && c.selected && b.append(a.name, c.value);
                    }); else if ("checkbox" === a.type || "radio" === a.type) a.checked && b.append(a.name, a.value); else {
                        var c = "textarea" === a.type ? function(a) {
                            return "string" == typeof a && (a = a.replace(/\r\n/g, "\n").replace(/\n/g, "\r\n")), 
                            a;
                        }(a.value) : a.value;
                        b.append(a.name, c);
                    }
                });
            };
            if ((k = Z.prototype).append = function(a, b, d) {
                var c = X.get(this);
                c[a] || (c[a] = []), c[a].push([ b, d ]);
            }, k.delete = function(a) {
                delete X.get(this)[a];
            }, k.entries = function b() {
                var c, e, f, g, h, d = this;
                return M(b, function(b) {
                    switch (b.b) {
                      case 1:
                        c = X.get(d), f = new G(c);

                      case 2:
                        var t;
                        a: {
                            for (t = f; 0 < t.j.length; ) {
                                var w = t.j.pop();
                                if (w in t.w) {
                                    t = w;
                                    break a;
                                }
                            }
                            t = null;
                        }
                        if (null == (e = t)) {
                            b.b = 0;
                            break;
                        }
                        g = x(c[e]), h = g.next();

                      case 5:
                        if (h.done) {
                            b.b = 2;
                            break;
                        }
                        return F(b, [ e, R(h.value) ], 6);

                      case 6:
                        h = g.next(), b.b = 5;
                    }
                });
            }, k.forEach = function(b, d) {
                for (var c = x(this), e = c.next(); !e.done; e = c.next()) {
                    var f = x(e.value);
                    e = f.next().value, f = f.next().value, b.call(d, f, e, this);
                }
            }, k.get = function(b) {
                var d = X.get(this);
                return d[b] ? R(d[b][0]) : null;
            }, k.getAll = function(b) {
                return (X.get(this)[b] || []).map(R);
            }, k.has = function(b) {
                return b in X.get(this);
            }, k.keys = function d() {
                var e, f, c = this;
                return M(d, function(d) {
                    if (1 == d.b && (e = x(c), f = e.next()), 3 != d.b) return f.done ? void (d.b = 0) : F(d, x(f.value).next().value, 3);
                    f = e.next(), d.b = 2;
                });
            }, k.set = function(d, c, e) {
                X.get(this)[d] = [ [ c, e ] ];
            }, k.values = function c() {
                var f, g, q, e = this;
                return M(c, function(c) {
                    if (1 == c.b && (f = x(e), g = f.next()), 3 != c.b) return g.done ? void (c.b = 0) : ((q = x(g.value)).next(), 
                    F(c, q.next().value, 3));
                    g = f.next(), c.b = 2;
                });
            }, Z.prototype._asNative = function() {
                for (var c = new T(), e = x(this), f = e.next(); !f.done; f = e.next()) {
                    var g = x(f.value);
                    f = g.next().value, g = g.next().value, c.append(f, g);
                }
                return c;
            }, Z.prototype._blob = function() {
                for (var c = "----formdata-polyfill-" + Math.random(), e = [], f = x(this), g = f.next(); !g.done; g = f.next()) {
                    var h = x(g.value);
                    g = h.next().value, h = h.next().value, e.push("--" + c + "\r\n"), h instanceof Blob ? e.push('Content-Disposition: form-data; name="' + g + '"; filename="' + h.name + '"\r\n', "Content-Type: " + (h.type || "application/octet-stream") + "\r\n\r\n", h, "\r\n") : e.push('Content-Disposition: form-data; name="' + g + '"\r\n\r\n' + h + "\r\n");
                }
                return e.push("--" + c + "--"), new Blob(e, {
                    type: "multipart/form-data; boundary=" + c
                });
            }, Z.prototype[Symbol.iterator] = function() {
                return this.entries();
            }, Z.prototype.toString = function() {
                return "[object FormData]";
            }, W && (Z.prototype[W] = "FormData"), [ [ "append", P ], [ "delete", Q ], [ "get", Q ], [ "getAll", Q ], [ "has", Q ], [ "set", P ] ].forEach(function(c) {
                var e = Z.prototype[c[0]];
                Z.prototype[c[0]] = function() {
                    return e.apply(this, c[1].apply(this, Y(arguments)));
                };
            }), U && (XMLHttpRequest.prototype.send = function(c) {
                c instanceof Z ? (c = c._blob(), this.setRequestHeader("Content-Type", c.type), 
                U.call(this, c)) : U.call(this, c);
            }), V) {
                var aa = S.fetch;
                S.fetch = function(c, e) {
                    return e && e.body && e.body instanceof Z && (e.body = e.body._blob()), aa(c, e);
                };
            }
            S.FormData = Z;
        }
    }(), Element.prototype.matches || (Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector);
    var _scriptsConfig$SELECT = config$1.SELECTORS, CART = _scriptsConfig$SELECT.CART, CHECKOUT_INPUT = _scriptsConfig$SELECT.CHECKOUT_INPUT;
    var transformCartData = function(cartData) {
        return cartData.items.map(function(item) {
            return {
                quantity: item.quantity,
                variantId: btoa("gid://shopify/ProductVariant/" + item.variant_id)
            };
        });
    };
    var makeGraphQLCheckoutPayload = function(items) {
        return {
            lineItems: items
        };
    };
    var handleFetchError = function(response) {
        if (!response.ok) throw Error(response.statusText);
        return response;
    };
    var customCheckoutCartSubmitHandler = function(event) {
        event.preventDefault(), event.stopPropagation();
        var filteredInputs = _toConsumableArray(this.querySelectorAll('[name="updates[]"]')).filter(function(input) {
            return parseInt(input.value, 10) > 0;
        });
        if (0 === filteredInputs.length) return window.location.reload(), !1;
        var postForm = document.createElement("form");
        filteredInputs.forEach(function(input) {
            return postForm.appendChild(input.cloneNode());
        }), fetch("/cart", {
            method: "POST",
            body: new FormData(postForm)
        }).then(handleFetchError).then(function(res) {
            return res.json();
        }).then(transformCartData).then(makeGraphQLCheckoutPayload).then(createCheckout).then(function(res) {
            res.checkout && res.checkout.webUrl && window.location.assign(res.checkout.webUrl);
        }).catch(function(error) {
            console.error(error), window.location.reload();
        });
    };
    var getErrorMessage = function(error) {
        return "string" == typeof error.message ? error.message : error;
    };
    var _pcConfig$SHOPIFY_API = config.SHOPIFY_API, GET_CART = _pcConfig$SHOPIFY_API.GET_CART, UPDATE_CART = _pcConfig$SHOPIFY_API.UPDATE_CART;
    var _scriptsConfig$SELECT$1 = config$1.SELECTORS, CART_COUNT = _scriptsConfig$SELECT$1.CART_COUNT, CUSTOMER_ID = _scriptsConfig$SELECT$1.CUSTOMER_ID;
    var finalCartUpdates = function(cart) {
        if (!cart) throw Error("Cart not passed to handler for updating UI.");
        return setStoredShopifyCart(cart), updateCartUI(cart.item_count), cart;
    };
    var shouldReconcileCarts = function() {
        var existingCustomer = cache.customer;
        var shopifyCart = getStoredShopifyCart();
        if (!shopifyCart || getWasLoggedIn() && !cache.customerCartExpired) return !1;
        if (cache.customerCartExpired) return !0;
        if (!existingCustomer || !shopifyCart.token) throw Error("Checking whether carts should be reconciled failed because " + cache.customerID + " or a Shopify cart ID could not be found.");
        return existingCustomer && existingCustomer.cartID && existingCustomer.cartID !== shopifyCart.token;
    };
    var assignCartIfNew = function(shopifyCart) {
        void 0 === shopifyCart && (shopifyCart = getStoredShopifyCart());
        var existingCustomer = cache.customer;
        var setNewCustomerOrCart = shopifyCart && (!existingCustomer || existingCustomer && !existingCustomer.cartID);
        if (cache.setNewCustomerOrCart = setNewCustomerOrCart, setNewCustomerOrCart) return createOrUpdateCustomer({
            customerID: cache.customerID,
            cart: shopifyCart
        }).then(function(customer) {
            return cache.customer = customer, existingCustomer = customer, !1;
        });
        if (existingCustomer && existingCustomer.cartID) return !0;
        if (!shopifyCart && !existingCustomer || existingCustomer && !existingCustomer.cartID) return !1;
        throw Error("Customer " + cache.customerID + " should already have been set in the database, but has not been.");
    };
    var fetchShopifyCart = function(cartID) {
        return cartID && setCartCookie(cartID), fetch$1(GET_CART, {
            headers: {
                pragma: "no-cache",
                "cache-control": "no-cache"
            }
        }).then(function(res) {
            return res.json();
        }).then(function(cart) {
            if (!cart) throw Error("Could not fetch a cart from Shopify with cartID " + (cartID || getCartCookie) + ".");
            return cart;
        });
    };
    var persistPageLoadShopifyCart = function(cart) {
        return cart ? setStoredShopifyCart(cart) : removeStoredShopifyCart(), getStoredShopifyCart();
    };
    var persistCustomerCartExpired = function(expired) {
        return cache.customerCartExpired = expired, expired;
    };
    var persistMasterShopifyCart = function(cart) {
        return cache.masterShopifyCart = cart, cart;
    };
    var pcInit = function(customer) {
        return cache.customer = customer, (cache.currentCartCount > 0 ? fetchShopifyCart() : Promise.resolve(null)).then(persistPageLoadShopifyCart).then(assignCartIfNew).then(function(shouldHandleReconciliationAndExpiration) {
            return shouldHandleReconciliationAndExpiration ? (((pageLoadShopifyCart = getStoredShopifyCart()) && pageLoadShopifyCart.token ? pageLoadShopifyCart.token : null) !== (cache.customer && cache.customer.cartID ? cache.customer.cartID : null) ? fetchShopifyCart(cache.customer.cartID).then(persistMasterShopifyCart) : Promise.resolve(getStoredShopifyCart())).then(function(cart) {
                return cartToUseForUpdates = cart, void 0 === (masterShopifyCart = cart) && (masterShopifyCart = cache.masterShopifyCart), 
                masterShopifyCart && masterShopifyCart.token !== cache.customer.cartID;
                var masterShopifyCart;
            }).then(persistCustomerCartExpired).then(shouldReconcileCarts).then(function(shouldReconcile) {
                return shouldReconcile ? function(reconciledCarts) {
                    if (void 0 === reconciledCarts && (reconciledCarts = null), !reconciledCarts) throw Error("updateShopifyCart was called without a payload.");
                    var newCartID = cache.customerCartExpired ? cache.masterShopifyCart.token : cache.customer.cartID;
                    if (!newCartID) throw Error("Before updating the Shopify cart, there is no token to set.");
                    cache.customerCartExpired && setCartCookie(newCartID);
                    var updateOptions = {
                        headers: {
                            "Content-Type": "application/json",
                            pragma: "no-cache",
                            "cache-control": "no-cache"
                        },
                        method: "POST",
                        body: JSON.stringify({
                            updates: reconciledCarts
                        })
                    };
                    return fetch$1(UPDATE_CART, updateOptions).then(function(res) {
                        return res.json();
                    }).then(function(updatedShopifyCart) {
                        if (updatedShopifyCart && "item_count" in updatedShopifyCart) return setStoredShopifyCart(updatedShopifyCart), 
                        updatedShopifyCart;
                        throw Error("No cart returned after attempting to update after setting cart cookie with cartID (" + newCartID + ")" + (reconciledCarts ? ", with reconciled carts: " + reconciledCarts : "") + ".");
                    });
                }((currentCart = getStoredShopifyCart(), cart2 = cache.customerCartExpired ? cache.customer.cart : cache.masterShopifyCart, 
                [].concat(_toConsumableArray(getLineItems(cache.customerCartExpired ? null : currentCart)), _toConsumableArray(getLineItems(cart2))).reduce(function(acc, curr) {
                    return acc[curr.id] = (acc[curr.id] || 0) + curr.quantity, acc;
                }, {}))).then(function(cart) {
                    return cache.customerCartExpired ? function(cart) {
                        return void 0 === cart && (cart = getStoredShopifyCart()), createOrUpdateCustomer({
                            customerID: cache.customer.customerID,
                            cart: cart
                        }).then(function(updatedCustomer) {
                            return updatedCustomer.cart;
                        });
                    }(cart) : cart;
                }).then(finalCartUpdates) : finalCartUpdates(cartToUseForUpdates);
                var currentCart, cart2;
            }) : cache.setNewCustomerOrCart ? "A customer was just created or updated: ' " + cache.customer.customerID : "There's no saved customer, or the saved customer has no cart, and the Shopify cart is empty, so ending";
            var cartToUseForUpdates, pageLoadShopifyCart;
        });
    };
    document.addEventListener("DOMContentLoaded", function() {
        var cidEl = document.querySelector(CUSTOMER_ID);
        var customerID, _ref2;
        cache.currentCartCount = parseInt(document.querySelector(CART_COUNT).value, 10), 
        cache.customerID = cidEl && cidEl.value ? cidEl.value : null, localStorageAvailable && cookiesAvailable && (cache.customerID ? (customerID = cache.customerID, 
        makeUncachedRequest((_ref2 = {
            query: getCustomerQuery,
            customerID: customerID
        }).query, {
            customerID: _ref2.customerID
        }, API_URL).then(function(data) {
            return data.getCustomer;
        }).catch(function(error) {
            throw Error("Error getting customer from database: " + error.message);
        })).then(function(customerResponse) {
            if (customerResponse && ("object" != typeof customerResponse || "error" in customerResponse)) {
                if ("error" in customerResponse) throw Error(customerResponse.error);
            } else customer = customerResponse, console.log("Persistent Cart JS loaded"), (logoutLink = document.querySelector(LOGOUT)) && logoutLink.addEventListener("click", logoutHandler), 
            document.addEventListener("submit", function(e) {
                for (var target = e.target; target && target !== this; target = target.parentNode) if (target.matches(CART) && e.currentTarget.activeElement.matches(CHECKOUT_INPUT)) {
                    customCheckoutCartSubmitHandler.call(target, e);
                    break;
                }
            }), pcInit(customer).then(function(response) {
                if (response && response.error) throw Error(getErrorMessage(response.error));
                setWasLoggedIn();
            }).catch(function(error) {
                setWasLoggedIn(), console.error("Persistent cart errors or messages: ", getErrorMessage(error));
            }), function(persistentCartInit) {
                var ShopifyAPI = window.ShopifyAPI;
                if (ShopifyAPI && ShopifyAPI.addItemFromForm) {
                    var originalShopifyAddItemFromForm = ShopifyAPI.addItemFromForm;
                    ShopifyAPI.addItemFromForm = function() {
                        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
                        var newArgs = args.map(function(arg) {
                            return "function" == typeof arg ? (fn = arg, function() {
                                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
                                var lineItemObject = args.find(function(arg) {
                                    return function(value) {
                                        if (!function(value) {
                                            return !!value && "object" == typeof value;
                                        }(value) || "[object Object]" != objectToString.call(value) || function(value) {
                                            var result = !1;
                                            if (null != value && "function" != typeof value.toString) try {
                                                result = !!(value + "");
                                            } catch (e) {}
                                            return result;
                                        }(value)) return !1;
                                        var proto = getPrototype(value);
                                        if (null === proto) return !0;
                                        var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
                                        return "function" == typeof Ctor && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
                                    }(arg) && "variant_id" in arg && "quantity" in arg;
                                });
                                return lineItemObject && (cache.currentCartCount += lineItemObject.quantity, pcInit(customer)), 
                                fn.apply(void 0, args);
                            }) : arg;
                            var fn;
                        });
                        return originalShopifyAddItemFromForm.apply(void 0, _toConsumableArray(newArgs));
                    };
                }
            }();
            var customer, logoutLink;
        }).catch(function(error) {
            throw Error("Persistent cart not responding: " + getErrorMessage(error));
        }) : (getWasLoggedIn() && (removeCartCookie(), updateCartUI(0)), removeItemFromLocalStorage(LOGGED_IN), 
        removeStoredShopifyCart()));
    });
}();
