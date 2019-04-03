!(function() {
  "use strict";
  function t() {
    return (t =
      Object.assign ||
      function(t) {
        for (var e = 1; e < arguments.length; e++) {
          var n = arguments[e];
          for (var r in n)
            Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]);
        }
        return t;
      }).apply(this, arguments);
  }
  function e(t, e) {
    return e || (e = t.slice(0)), (t.raw = e), t;
  }
  function n(t) {
    return (
      (function(t) {
        if (Array.isArray(t)) {
          for (var e = 0, n = Array(t.length); e < t.length; e++) n[e] = t[e];
          return n;
        }
      })(t) ||
      (function(t) {
        if (
          Symbol.iterator in Object(t) ||
          "[object Arguments]" === Object.prototype.toString.call(t)
        )
          return Array.from(t);
      })(t) ||
      (function() {
        throw new TypeError("Invalid attempt to spread non-iterable instance");
      })()
    );
  }
  var r = /(query|mutation) ?([\w\d-_]+)? ?\(.*?\)? \{/;
  function o(t) {
    var e = Array.isArray(t) ? t.join("") : t,
      n = r.exec(e);
    return function(t) {
      var r = { query: e };
      return (
        t && (r.variables = t),
        Array.isArray(n) && n[2] && n[2] && (r.operationName = n[2]),
        JSON.stringify(r)
      );
    };
  }
  var i = ["www.decathlon.com"],
    u = ["testing-decathlon-usa.myshopify.com"],
    a = {
      get API_URL() {
        var t = window.location.hostname;
        return (
          u.some(function(e) {
            return t.match(RegExp(e));
          }),
          i.some(function(e) {
            return t.match(RegExp(e));
          }),
          "https://persistent-cart-decathlonusa-p.herokuapp.com/shopify/graphql"
        );
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
      SHOPIFY_API: { GET_CART: "/cart.js", UPDATE_CART: "/cart/update.js" },
      COOKIES: {
        CART: "cart",
        CART_TS: "cart_ts",
        CART_SIG: "cart_sig",
        CART_CURRENCY: "cart_currency"
      },
      get ALL_CART_COOKIES() {
        var t = this;
        return Object.keys(this.COOKIES).map(function(e) {
          return t.COOKIES[e];
        });
      },
      get CART_COOKIE() {
        return this.COOKIES.CART;
      }
    },
    c = {
      PROD_HOSTNAME: "www.decathlon.com",
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
          STEPS: {
            CONTACT_INFORMATION: "contact_information",
            SHIPPING_METHOD: "shipping_method",
            PAYMENT_METHOD: "payment_method",
            PROCESSING: "processing",
            REVIEW: "review"
          },
          URLS: {
            ROOT_URL: "/",
            get CART_URL() {
              return this.ROOT_URL + "cart";
            }
          },
          TEXT: { CART_TEXT: "Cart" },
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
                  return (
                    c.SELECTORS.CHECKOUT.CLASSES.BREADCRUMBS.BC_ROOT +
                    "_cart_link"
                  );
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
  function s(t, e) {
    return (
      (e = e || {}),
      new Promise(function(n, r) {
        var o = new XMLHttpRequest();
        for (var i in (o.open(e.method || "get", t, !0), e.headers))
          o.setRequestHeader(i, e.headers[i]);
        function u() {
          var t,
            e = [],
            n = [],
            r = {};
          return (
            o
              .getAllResponseHeaders()
              .replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm, function(o, i, u) {
                e.push((i = i.toLowerCase())),
                  n.push([i, u]),
                  (r[i] = (t = r[i]) ? t + "," + u : u);
              }),
            {
              ok: 2 == ((o.status / 100) | 0),
              status: o.status,
              statusText: o.statusText,
              url: o.responseURL,
              clone: u,
              text: function() {
                return Promise.resolve(o.responseText);
              },
              json: function() {
                return Promise.resolve(o.responseText).then(JSON.parse);
              },
              blob: function() {
                return Promise.resolve(new Blob([o.response]));
              },
              headers: {
                keys: function() {
                  return e;
                },
                entries: function() {
                  return n;
                },
                get: function(t) {
                  return r[t.toLowerCase()];
                },
                has: function(t) {
                  return t.toLowerCase() in r;
                }
              }
            }
          );
        }
        (o.withCredentials = "include" == e.credentials),
          (o.onload = function() {
            n(u());
          }),
          (o.onerror = r),
          o.send(e.body || null);
      })
    );
  }
  var f = c.STOREFRONT_API,
    l = c.NO_CACHE_HEADERS,
    h = function(e, n, r, o) {
      return (
        void 0 === o && (o = {}),
        (function(e, n, r, o) {
          return (
            void 0 === o && (o = {}),
            s(r || a.API_URL, {
              body: e(n),
              method: "POST",
              headers: t(
                {
                  "Content-Type": "application/json",
                  Accept: "application/json"
                },
                o.headers
              )
            })
              .then(function(t) {
                return t.json();
              })
              .then(function(t) {
                var e = t.data,
                  n = t.errors;
                if (n) {
                  var r = n.reduce(function(t, e, n) {
                    return t + (n > 0 ? ", " : "") + e.message;
                  }, "");
                  console.info("PC: ", r);
                }
                return e;
              })
          );
        })(e, n, r, { headers: t({}, l, o.headers) })
      );
    };
  function p() {
    var t = e([
      "\n  query($customerID: ID!) {\n    getCustomer(customerID: $customerID) {\n      customerID\n      cart\n      cartID\n    }\n  }\n"
    ]);
    return (
      (p = function() {
        return t;
      }),
      t
    );
  }
  function d() {
    var t = e([
      "\n  mutation($customerID: ID!, $cart: JSON) {\n    createOrUpdateCustomer(customerID: $customerID, cart: $cart) {\n      customerID\n      cart\n      cartID\n    }\n  }\n"
    ]);
    return (
      (d = function() {
        return t;
      }),
      t
    );
  }
  var m,
    v = a.API_URL,
    y = o(d()),
    E = o(p()),
    g = function(t) {
      var e;
      return h(
        (e = { mutation: y, customerID: t.customerID, cart: t.cart }).mutation,
        { customerID: e.customerID, cart: e.cart },
        v
      )
        .then(function(t) {
          return t.createOrUpdateCustomer;
        })
        .catch(function(t) {
          throw Error(
            "Error creating or updating customer in database: " + t.message
          );
        });
    },
    _ =
      "undefined" != typeof window
        ? window
        : "undefined" != typeof global
        ? global
        : "undefined" != typeof self
        ? self
        : {},
    b = ((function(t, e) {
      t.exports = (function() {
        function t() {
          for (var t = 0, e = {}; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) e[r] = n[r];
          }
          return e;
        }
        return (function e(n) {
          function r(e, o, i) {
            var u;
            if ("undefined" != typeof document) {
              if (arguments.length > 1) {
                if (
                  "number" ==
                  typeof (i = t({ path: "/" }, r.defaults, i)).expires
                ) {
                  var a = new Date();
                  a.setMilliseconds(a.getMilliseconds() + 864e5 * i.expires),
                    (i.expires = a);
                }
                i.expires = i.expires ? i.expires.toUTCString() : "";
                try {
                  (u = JSON.stringify(o)), /^[\{\[]/.test(u) && (o = u);
                } catch (t) {}
                (o = n.write
                  ? n.write(o, e)
                  : encodeURIComponent(o + "").replace(
                      /%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,
                      decodeURIComponent
                    )),
                  (e = (e = (e = encodeURIComponent(e + "")).replace(
                    /%(23|24|26|2B|5E|60|7C)/g,
                    decodeURIComponent
                  )).replace(/[\(\)]/g, escape));
                var c = "";
                for (var s in i)
                  i[s] && ((c += "; " + s), !0 !== i[s] && (c += "=" + i[s]));
                return (document.cookie = e + "=" + o + c);
              }
              e || (u = {});
              for (
                var f = document.cookie ? document.cookie.split("; ") : [],
                  l = /(%[0-9A-Z]{2})+/g,
                  h = 0;
                h < f.length;
                h++
              ) {
                var p = f[h].split("="),
                  d = p.slice(1).join("=");
                this.json || '"' !== d.charAt(0) || (d = d.slice(1, -1));
                try {
                  var m = p[0].replace(l, decodeURIComponent);
                  if (
                    ((d = n.read
                      ? n.read(d, m)
                      : n(d, m) || d.replace(l, decodeURIComponent)),
                    this.json)
                  )
                    try {
                      d = JSON.parse(d);
                    } catch (t) {}
                  if (e === m) {
                    u = d;
                    break;
                  }
                  e || (u[m] = d);
                } catch (t) {}
              }
              return u;
            }
          }
          return (
            (r.set = r),
            (r.get = function(t) {
              return r.call(r, t);
            }),
            (r.getJSON = function() {
              return r.apply({ json: !0 }, [].slice.call(arguments));
            }),
            (r.defaults = {}),
            (r.remove = function(e, n) {
              r(e, "", t(n, { expires: -1 }));
            }),
            (r.withConverter = e),
            r
          );
        })(function() {});
      })();
    })((m = { exports: {} })),
    m.exports),
    C = function(t) {
      var e;
      try {
        e = window[t];
        var n = "__storage_test__";
        return e.setItem(n, n), e.removeItem(n), !0;
      } catch (t) {
        return (
          t instanceof DOMException &&
          (22 === t.code ||
            1014 === t.code ||
            "QuotaExceededError" === t.name ||
            "NS_ERROR_DOM_QUOTA_REACHED" === t.name) &&
          0 !== e.length
        );
      }
    },
    w = C("localStorage"),
    I = (C("sessionStorage"),
    (function() {
      var t = "persistent-cart-test";
      b.set(t, "foo");
      var e = b.get(t);
      b.remove(t);
      var n = b.get(t);
      return e && !n;
    })()),
    O = function(t, e) {
      return localStorage.setItem(t, JSON.stringify(e));
    },
    S = function(t) {
      return JSON.parse(localStorage.getItem(t));
    },
    R = function(t) {
      return localStorage.removeItem(t);
    },
    T = a.STORAGE,
    A = T.LOGGED_IN,
    D = T.SHOPIFY_CART,
    P = function() {
      return S(D);
    },
    j = function(t) {
      return O(D, t);
    },
    x = function() {
      return R(D);
    },
    F = function() {
      return O(A, !0);
    },
    k = function() {
      return !!S(A);
    },
    N = {
      customerID: null,
      customer: null,
      masterShopifyCart: null,
      customerCartExpired: !1,
      currentCartCount: 0,
      setNewCustomerOrCart: !1
    },
    U = function(t) {
      return ((t && (t.items || t.line_items)) || []).map(function(t) {
        return { id: t.variant_id, quantity: t.quantity };
      });
    };
  function L(t) {
    var e = this.constructor;
    return this.then(
      function(n) {
        return e.resolve(t()).then(function() {
          return n;
        });
      },
      function(n) {
        return e.resolve(t()).then(function() {
          return e.reject(n);
        });
      }
    );
  }
  var M = setTimeout;
  function B() {}
  function q(t) {
    if (!(this instanceof q))
      throw new TypeError("Promises must be constructed via new");
    if ("function" != typeof t) throw new TypeError("not a function");
    (this._state = 0),
      (this._handled = !1),
      (this._value = void 0),
      (this._deferreds = []),
      $(t, this);
  }
  function H(t, e) {
    for (; 3 === t._state; ) t = t._value;
    0 !== t._state
      ? ((t._handled = !0),
        q._immediateFn(function() {
          var n = 1 === t._state ? e.onFulfilled : e.onRejected;
          if (null !== n) {
            var r;
            try {
              r = n(t._value);
            } catch (t) {
              return void K(e.promise, t);
            }
            X(e.promise, r);
          } else (1 === t._state ? X : K)(e.promise, t._value);
        }))
      : t._deferreds.push(e);
  }
  function X(t, e) {
    try {
      if (e === t)
        throw new TypeError("A promise cannot be resolved with itself.");
      if (e && ("object" == typeof e || "function" == typeof e)) {
        var n = e.then;
        if (e instanceof q) return (t._state = 3), (t._value = e), void G(t);
        if ("function" == typeof n)
          return void $(
            ((r = n),
            (o = e),
            function() {
              r.apply(o, arguments);
            }),
            t
          );
      }
      (t._state = 1), (t._value = e), G(t);
    } catch (e) {
      K(t, e);
    }
    var r, o;
  }
  function K(t, e) {
    (t._state = 2), (t._value = e), G(t);
  }
  function G(t) {
    2 === t._state &&
      0 === t._deferreds.length &&
      q._immediateFn(function() {
        t._handled || q._unhandledRejectionFn(t._value);
      });
    for (var e = 0, n = t._deferreds.length; e < n; e++) H(t, t._deferreds[e]);
    t._deferreds = null;
  }
  function J(t, e, n) {
    (this.onFulfilled = "function" == typeof t ? t : null),
      (this.onRejected = "function" == typeof e ? e : null),
      (this.promise = n);
  }
  function $(t, e) {
    var n = !1;
    try {
      t(
        function(t) {
          n || ((n = !0), X(e, t));
        },
        function(t) {
          n || ((n = !0), K(e, t));
        }
      );
    } catch (t) {
      if (n) return;
      (n = !0), K(e, t);
    }
  }
  (q.prototype.catch = function(t) {
    return this.then(null, t);
  }),
    (q.prototype.then = function(t, e) {
      var n = new this.constructor(B);
      return H(this, new J(t, e, n)), n;
    }),
    (q.prototype.finally = L),
    (q.all = function(t) {
      return new q(function(e, n) {
        if (!t || void 0 === t.length)
          throw new TypeError("Promise.all accepts an array");
        var r = Array.prototype.slice.call(t);
        if (0 === r.length) return e([]);
        var o = r.length;
        function i(t, u) {
          try {
            if (u && ("object" == typeof u || "function" == typeof u)) {
              var a = u.then;
              if ("function" == typeof a)
                return void a.call(
                  u,
                  function(e) {
                    i(t, e);
                  },
                  n
                );
            }
            (r[t] = u), 0 == --o && e(r);
          } catch (t) {
            n(t);
          }
        }
        for (var u = 0; u < r.length; u++) i(u, r[u]);
      });
    }),
    (q.resolve = function(t) {
      return t && "object" == typeof t && t.constructor === q
        ? t
        : new q(function(e) {
            e(t);
          });
    }),
    (q.reject = function(t) {
      return new q(function(e, n) {
        n(t);
      });
    }),
    (q.race = function(t) {
      return new q(function(e, n) {
        for (var r = 0, o = t.length; r < o; r++) t[r].then(e, n);
      });
    }),
    (q._immediateFn =
      ("function" == typeof setImmediate &&
        function(t) {
          setImmediate(t);
        }) ||
      function(t) {
        M(t, 0);
      }),
    (q._unhandledRejectionFn = function(t) {
      void 0 !== console &&
        console &&
        console.warn("Possible Unhandled Promise Rejection:", t);
    });
  var Y = (function() {
    if ("undefined" != typeof self) return self;
    if ("undefined" != typeof window) return window;
    if ("undefined" != typeof global) return global;
    throw Error("unable to locate global object");
  })();
  "Promise" in Y
    ? Y.Promise.prototype.finally || (Y.Promise.prototype.finally = L)
    : (Y.Promise = q);
  var V,
    Q,
    W = a.CART_COOKIE,
    Z = function(t) {
      return b.set(W, t);
    },
    z = b.get(W),
    tt = function() {
      return b.remove(W);
    },
    et = Object.prototype,
    nt = Function.prototype.toString,
    rt = et.hasOwnProperty,
    ot = nt.call(Object),
    it = et.toString,
    ut = ((V = Object.getPrototypeOf),
    (Q = Object),
    function(t) {
      return V(Q(t));
    }),
    at = function(t) {
      var e = document.querySelector(".js-cart-count");
      e && (e.innerText = t);
    },
    ct = c.SELECTORS.LOGOUT,
    st = function() {
      tt();
    };
  function ft() {
    var t = e([
      "\n  mutation checkoutCreate($input: CheckoutCreateInput!) {\n    checkoutCreate(input: $input) {\n      checkout {\n        id\n        webUrl\n      }\n      checkoutUserErrors {\n        code\n        field\n        message\n      }\n    }\n  }\n"
    ]);
    return (
      (ft = function() {
        return t;
      }),
      t
    );
  }
  var lt = o(ft()),
    ht = function(t) {
      return ((n = (e = { mutation: lt, input: t }).mutation),
      (r = { input: e.input }),
      (o = {}),
      (o[f.HEADER_NAME] = f.KEY),
      h(n, r, "/api/graphql", { headers: o }))
        .then(function(t) {
          return t.checkoutCreate;
        })
        .catch(function(t) {
          throw Error("Error getting customer from database: " + t.message);
        });
      var e, n, r, o;
    };
  !(function() {
    var t;
    function e(t) {
      var e = 0;
      return function() {
        return e < t.length ? { done: !1, value: t[e++] } : { done: !0 };
      };
    }
    var n =
        "function" == typeof Object.defineProperties
          ? Object.defineProperty
          : function(t, e, n) {
              t != Array.prototype && t != Object.prototype && (t[e] = n.value);
            },
      r =
        "undefined" != typeof window && window === this
          ? this
          : void 0 !== _ && null != _
          ? _
          : this;
    function o() {
      (o = function() {}), r.Symbol || (r.Symbol = a);
    }
    var i,
      u,
      a = ((i = 0),
      function(t) {
        return "jscomp_symbol_" + (t || "") + i++;
      });
    function c() {
      o();
      var t = r.Symbol.iterator;
      t || (t = r.Symbol.iterator = r.Symbol("iterator")),
        "function" != typeof Array.prototype[t] &&
          n(Array.prototype, t, {
            configurable: !0,
            writable: !0,
            value: function() {
              return (
                (t = e(this)),
                c(),
                ((t = { next: t })[r.Symbol.iterator] = function() {
                  return this;
                }),
                t
              );
              var t;
            }
          }),
        (c = function() {});
    }
    function s(t) {
      var n =
        "undefined" != typeof Symbol && Symbol.iterator && t[Symbol.iterator];
      return n ? n.call(t) : { next: e(t) };
    }
    if ("function" == typeof Object.setPrototypeOf) u = Object.setPrototypeOf;
    else {
      var f;
      t: {
        var l = {};
        try {
          (l.__proto__ = { o: !0 }), (f = l.o);
          break t;
        } catch (i) {}
        f = !1;
      }
      u = f
        ? function(t, e) {
            if (((t.__proto__ = e), t.__proto__ !== e))
              throw new TypeError(t + " is not extensible");
            return t;
          }
        : null;
    }
    var h = u;
    function p() {
      (this.g = !1),
        (this.c = null),
        (this.m = void 0),
        (this.b = 1),
        (this.l = this.s = 0),
        (this.f = null);
    }
    function d(t) {
      if (t.g) throw new TypeError("Generator is already running");
      t.g = !0;
    }
    function m(t, e, n) {
      return (t.b = n), { value: e };
    }
    function v(t) {
      for (var e in ((this.w = t), (this.j = []), t)) this.j.push(e);
      this.j.reverse();
    }
    function y(t) {
      (this.a = new p()), (this.A = t);
    }
    function E(t, e, n, r) {
      try {
        var o = e.call(t.a.c, n);
        if (!(o instanceof Object))
          throw new TypeError("Iterator result " + o + " is not an object");
        if (!o.done) return (t.a.g = !1), o;
        var i = o.value;
      } catch (e) {
        return (t.a.c = null), t.a.i(e), g(t);
      }
      return (t.a.c = null), r.call(t.a, i), g(t);
    }
    function g(t) {
      for (; t.a.b; )
        try {
          var e = t.A(t.a);
          if (e) return (t.a.g = !1), { value: e.value, done: !1 };
        } catch (e) {
          (t.a.m = void 0), t.a.i(e);
        }
      if (((t.a.g = !1), t.a.f)) {
        if (((e = t.a.f), (t.a.f = null), e.v)) throw e.u;
        return { value: e.return, done: !0 };
      }
      return { value: void 0, done: !0 };
    }
    function b(t) {
      (this.next = function(e) {
        return t.h(e);
      }),
        (this.throw = function(e) {
          return t.i(e);
        }),
        (this.return = function(e) {
          return (function(t, e) {
            d(t.a);
            var n = t.a.c;
            return n
              ? E(
                  t,
                  "return" in n
                    ? n.return
                    : function(t) {
                        return { value: t, done: !0 };
                      },
                  e,
                  t.a.return
                )
              : (t.a.return(e), g(t));
          })(t, e);
        }),
        c(),
        (this[Symbol.iterator] = function() {
          return this;
        });
    }
    function C(t, e) {
      var n = new b(new y(e));
      return h && h(n, t.prototype), n;
    }
    if (
      ((p.prototype.h = function(t) {
        this.m = t;
      }),
      (p.prototype.i = function(t) {
        (this.f = { u: t, v: !0 }), (this.b = this.s || this.l);
      }),
      (p.prototype.return = function(t) {
        (this.f = { return: t }), (this.b = this.l);
      }),
      (y.prototype.h = function(t) {
        return (
          d(this.a),
          this.a.c
            ? E(this, this.a.c.next, t, this.a.h)
            : (this.a.h(t), g(this))
        );
      }),
      (y.prototype.i = function(t) {
        return (
          d(this.a),
          this.a.c
            ? E(this, this.a.c.throw, t, this.a.h)
            : (this.a.i(t), g(this))
        );
      }),
      "undefined" == typeof FormData || !FormData.prototype.keys)
    ) {
      var w = function(t, e) {
          for (var n = 0; n < t.length; n++) e(t[n]);
        },
        I = function(t, e, n) {
          if (2 > arguments.length)
            throw new TypeError(
              "2 arguments required, but only " + arguments.length + " present."
            );
          return e instanceof Blob
            ? [
                t + "",
                e,
                void 0 !== n
                  ? n + ""
                  : "string" == typeof e.name
                  ? e.name
                  : "blob"
              ]
            : [t + "", e + ""];
        },
        O = function(t) {
          if (!arguments.length)
            throw new TypeError("1 argument required, but only 0 present.");
          return [t + ""];
        },
        S = function(t) {
          var e = s(t);
          return (
            (t = e.next().value),
            (e = e.next().value),
            t instanceof Blob &&
              (t = new File([t], e, {
                type: t.type,
                lastModified: t.lastModified
              })),
            t
          );
        },
        R =
          "object" == typeof window
            ? window
            : "object" == typeof self
            ? self
            : this,
        T = R.FormData,
        A = R.XMLHttpRequest && R.XMLHttpRequest.prototype.send,
        D = R.Request && R.fetch;
      o();
      var P = R.Symbol && Symbol.toStringTag,
        j = new WeakMap(),
        x =
          Array.from ||
          function(t) {
            return [].slice.call(t);
          };
      P &&
        (Blob.prototype[P] || (Blob.prototype[P] = "Blob"),
        "File" in R && !File.prototype[P] && (File.prototype[P] = "File"));
      try {
        new File([], "");
      } catch (i) {
        R.File = function(t, e, n) {
          return (
            (t = new Blob(t, n)),
            Object.defineProperties(t, {
              name: { value: e },
              lastModifiedDate: {
                value: (n =
                  n && void 0 !== n.lastModified
                    ? new Date(n.lastModified)
                    : new Date())
              },
              lastModified: { value: +n },
              toString: {
                value: function() {
                  return "[object File]";
                }
              }
            }),
            P && Object.defineProperty(t, P, { value: "File" }),
            t
          );
        };
      }
      o(), c();
      var F = function(t) {
        if ((j.set(this, Object.create(null)), !t)) return this;
        var e = this;
        w(t.elements, function(t) {
          if (
            t.name &&
            !t.disabled &&
            "submit" !== t.type &&
            "button" !== t.type
          )
            if ("file" === t.type)
              w(t.files || [], function(n) {
                e.append(t.name, n);
              });
            else if ("select-multiple" === t.type || "select-one" === t.type)
              w(t.options, function(n) {
                !n.disabled && n.selected && e.append(t.name, n.value);
              });
            else if ("checkbox" === t.type || "radio" === t.type)
              t.checked && e.append(t.name, t.value);
            else {
              var n =
                "textarea" === t.type
                  ? (function(t) {
                      return (
                        "string" == typeof t &&
                          (t = t.replace(/\r\n/g, "\n").replace(/\n/g, "\r\n")),
                        t
                      );
                    })(t.value)
                  : t.value;
              e.append(t.name, n);
            }
        });
      };
      if (
        (((t = F.prototype).append = function(t, e, n) {
          var r = j.get(this);
          r[t] || (r[t] = []), r[t].push([e, n]);
        }),
        (t.delete = function(t) {
          delete j.get(this)[t];
        }),
        (t.entries = function t() {
          var e,
            n,
            r,
            o,
            i,
            u = this;
          return C(t, function(t) {
            switch (t.b) {
              case 1:
                (e = j.get(u)), (r = new v(e));
              case 2:
                var a;
                t: {
                  for (a = r; 0 < a.j.length; ) {
                    var c = a.j.pop();
                    if (c in a.w) {
                      a = c;
                      break t;
                    }
                  }
                  a = null;
                }
                if (null == (n = a)) {
                  t.b = 0;
                  break;
                }
                (o = s(e[n])), (i = o.next());
              case 5:
                if (i.done) {
                  t.b = 2;
                  break;
                }
                return m(t, [n, S(i.value)], 6);
              case 6:
                (i = o.next()), (t.b = 5);
            }
          });
        }),
        (t.forEach = function(t, e) {
          for (var n = s(this), r = n.next(); !r.done; r = n.next()) {
            var o = s(r.value);
            (r = o.next().value), (o = o.next().value), t.call(e, o, r, this);
          }
        }),
        (t.get = function(t) {
          var e = j.get(this);
          return e[t] ? S(e[t][0]) : null;
        }),
        (t.getAll = function(t) {
          return (j.get(this)[t] || []).map(S);
        }),
        (t.has = function(t) {
          return t in j.get(this);
        }),
        (t.keys = function t() {
          var e,
            n,
            r = this;
          return C(t, function(t) {
            if ((1 == t.b && ((e = s(r)), (n = e.next())), 3 != t.b))
              return n.done ? void (t.b = 0) : m(t, s(n.value).next().value, 3);
            (n = e.next()), (t.b = 2);
          });
        }),
        (t.set = function(t, e, n) {
          j.get(this)[t] = [[e, n]];
        }),
        (t.values = function t() {
          var e,
            n,
            r,
            o = this;
          return C(t, function(t) {
            if ((1 == t.b && ((e = s(o)), (n = e.next())), 3 != t.b))
              return n.done
                ? void (t.b = 0)
                : ((r = s(n.value)).next(), m(t, r.next().value, 3));
            (n = e.next()), (t.b = 2);
          });
        }),
        (F.prototype._asNative = function() {
          for (
            var t = new T(), e = s(this), n = e.next();
            !n.done;
            n = e.next()
          ) {
            var r = s(n.value);
            (n = r.next().value), (r = r.next().value), t.append(n, r);
          }
          return t;
        }),
        (F.prototype._blob = function() {
          for (
            var t = "----formdata-polyfill-" + Math.random(),
              e = [],
              n = s(this),
              r = n.next();
            !r.done;
            r = n.next()
          ) {
            var o = s(r.value);
            (r = o.next().value),
              (o = o.next().value),
              e.push("--" + t + "\r\n"),
              o instanceof Blob
                ? e.push(
                    'Content-Disposition: form-data; name="' +
                      r +
                      '"; filename="' +
                      o.name +
                      '"\r\n',
                    "Content-Type: " +
                      (o.type || "application/octet-stream") +
                      "\r\n\r\n",
                    o,
                    "\r\n"
                  )
                : e.push(
                    'Content-Disposition: form-data; name="' +
                      r +
                      '"\r\n\r\n' +
                      o +
                      "\r\n"
                  );
          }
          return (
            e.push("--" + t + "--"),
            new Blob(e, { type: "multipart/form-data; boundary=" + t })
          );
        }),
        (F.prototype[Symbol.iterator] = function() {
          return this.entries();
        }),
        (F.prototype.toString = function() {
          return "[object FormData]";
        }),
        P && (F.prototype[P] = "FormData"),
        [
          ["append", I],
          ["delete", O],
          ["get", O],
          ["getAll", O],
          ["has", O],
          ["set", I]
        ].forEach(function(t) {
          var e = F.prototype[t[0]];
          F.prototype[t[0]] = function() {
            return e.apply(this, t[1].apply(this, x(arguments)));
          };
        }),
        A &&
          (XMLHttpRequest.prototype.send = function(t) {
            t instanceof F
              ? ((t = t._blob()),
                this.setRequestHeader("Content-Type", t.type),
                A.call(this, t))
              : A.call(this, t);
          }),
        D)
      ) {
        var k = R.fetch;
        R.fetch = function(t, e) {
          return (
            e && e.body && e.body instanceof F && (e.body = e.body._blob()),
            k(t, e)
          );
        };
      }
      R.FormData = F;
    }
  })(),
    Element.prototype.matches ||
      (Element.prototype.matches =
        Element.prototype.msMatchesSelector ||
        Element.prototype.webkitMatchesSelector);
  var pt = c.SELECTORS.CART,
    dt = function(t) {
      return t.items.map(function(t) {
        return {
          quantity: t.quantity,
          variantId: btoa("gid://shopify/ProductVariant/" + t.variant_id)
        };
      });
    },
    mt = function(t) {
      return { lineItems: t };
    },
    vt = function(t) {
      if (!t.ok) throw Error(t.statusText);
      return t;
    },
    yt = function(t) {
      t.preventDefault(), t.stopPropagation();
      var e = n(this.querySelectorAll('[name="updates[]"]')).filter(function(
        t
      ) {
        return parseInt(t.value, 10) > 0;
      });
      if (0 === e.length) return window.location.reload(), !1;
      var r = document.createElement("form");
      e.forEach(function(t) {
        return r.appendChild(t.cloneNode());
      }),
        fetch("/cart", { method: "POST", body: new FormData(r) })
          .then(vt)
          .then(function(t) {
            return t.json();
          })
          .then(dt)
          .then(mt)
          .then(ht)
          .then(function(t) {
            t.checkout &&
              t.checkout.webUrl &&
              window.location.assign(t.checkout.webUrl);
          })
          .catch(function(t) {
            console.error(t), window.location.reload();
          });
    },
    Et = function(t) {
      return "string" == typeof t.message ? t.message : t;
    },
    gt = a.SHOPIFY_API,
    _t = gt.GET_CART,
    bt = gt.UPDATE_CART,
    Ct = c.SELECTORS,
    wt = Ct.CART_COUNT,
    It = Ct.CUSTOMER_ID,
    Ot = function(t) {
      if (!t) throw Error("Cart not passed to handler for updating UI.");
      return j(t), at(t.item_count), t;
    },
    St = function() {
      var t = N.customer,
        e = P();
      if (!e || (k() && !N.customerCartExpired)) return !1;
      if (N.customerCartExpired) return !0;
      if (!t || !e.token)
        throw Error(
          "Checking whether carts should be reconciled failed because " +
            N.customerID +
            " or a Shopify cart ID could not be found."
        );
      return t && t.cartID && t.cartID !== e.token;
    },
    Rt = function(t) {
      void 0 === t && (t = P());
      var e = N.customer,
        n = t && (!e || (e && !e.cartID));
      if (((N.setNewCustomerOrCart = n), n))
        return g({ customerID: N.customerID, cart: t }).then(function(t) {
          return (N.customer = t), (e = t), !1;
        });
      if (e && e.cartID) return !0;
      if ((!t && !e) || (e && !e.cartID)) return !1;
      throw Error(
        "Customer " +
          N.customerID +
          " should already have been set in the database, but has not been."
      );
    },
    Tt = function(t) {
      return (
        t && Z(t),
        s(_t, { headers: { pragma: "no-cache", "cache-control": "no-cache" } })
          .then(function(t) {
            return t.json();
          })
          .then(function(e) {
            if (!e)
              throw Error(
                "Could not fetch a cart from Shopify with cartID " +
                  (t || z) +
                  "."
              );
            return e;
          })
      );
    },
    At = function(t) {
      return t ? j(t) : x(), P();
    },
    Dt = function(t) {
      return (N.customerCartExpired = t), t;
    },
    Pt = function(t) {
      return (N.masterShopifyCart = t), t;
    },
    jt = function(t) {
      return (
        (N.customer = t),
        (N.currentCartCount > 0 ? Tt() : Promise.resolve(null))
          .then(At)
          .then(Rt)
          .then(function(t) {
            return t
              ? (((r = P()) && r.token ? r.token : null) !==
                (N.customer && N.customer.cartID ? N.customer.cartID : null)
                  ? Tt(N.customer.cartID).then(Pt)
                  : Promise.resolve(P())
                )
                  .then(function(t) {
                    return (
                      (e = t),
                      void 0 === (n = t) && (n = N.masterShopifyCart),
                      n && n.token !== N.customer.cartID
                    );
                    var n;
                  })
                  .then(Dt)
                  .then(St)
                  .then(function(t) {
                    var r, o;
                    return t
                      ? (function(t) {
                          if ((void 0 === t && (t = null), !t))
                            throw Error(
                              "updateShopifyCart was called without a payload."
                            );
                          var e = N.customerCartExpired
                            ? N.masterShopifyCart.token
                            : N.customer.cartID;
                          if (!e)
                            throw Error(
                              "Before updating the Shopify cart, there is no token to set."
                            );
                          N.customerCartExpired && Z(e);
                          var n = {
                            headers: {
                              "Content-Type": "application/json",
                              pragma: "no-cache",
                              "cache-control": "no-cache"
                            },
                            method: "POST",
                            body: JSON.stringify({ updates: t })
                          };
                          return s(bt, n)
                            .then(function(t) {
                              return t.json();
                            })
                            .then(function(n) {
                              if (n && "item_count" in n) return j(n), n;
                              throw Error(
                                "No cart returned after attempting to update after setting cart cookie with cartID (" +
                                  e +
                                  ")" +
                                  (t ? ", with reconciled carts: " + t : "") +
                                  "."
                              );
                            });
                        })(
                          ((o = P()),
                          (r = N.customerCartExpired
                            ? N.customer.cart
                            : N.masterShopifyCart),
                          []
                            .concat(
                              n(U(N.customerCartExpired ? null : o)),
                              n(U(r))
                            )
                            .reduce(function(t, e) {
                              return (t[e.id] = (t[e.id] || 0) + e.quantity), t;
                            }, {}))
                        )
                          .then(function(t) {
                            return N.customerCartExpired
                              ? (function(t) {
                                  return (
                                    void 0 === t && (t = P()),
                                    g({
                                      customerID: N.customer.customerID,
                                      cart: t
                                    }).then(function(t) {
                                      return t.cart;
                                    })
                                  );
                                })(t)
                              : t;
                          })
                          .then(Ot)
                      : Ot(e);
                  })
              : N.setNewCustomerOrCart
              ? "A customer was just created or updated: ' " +
                N.customer.customerID
              : "There's no saved customer, or the saved customer has no cart, and the Shopify cart is empty, so ending";
            var e, r;
          })
      );
    };
  document.addEventListener("DOMContentLoaded", function() {
    var t,
      e,
      r = document.querySelector(It);
    (N.currentCartCount = parseInt(document.querySelector(wt).value, 10)),
      (N.customerID = r && r.value ? r.value : null),
      w &&
        I &&
        (N.customerID
          ? ((t = N.customerID),
            h(
              (e = { query: E, customerID: t }).query,
              { customerID: e.customerID },
              v
            )
              .then(function(t) {
                return t.getCustomer;
              })
              .catch(function(t) {
                throw Error(
                  "Error getting customer from database: " + t.message
                );
              }))
              .then(function(t) {
                if (t && ("object" != typeof t || "error" in t)) {
                  if ("error" in t) throw Error(t.error);
                } else
                  (e = t),
                    console.log("Persistent Cart JS loaded"),
                    (r = document.querySelector(ct)) &&
                      r.addEventListener("click", st),
                    document.addEventListener("submit", function(t) {
                      for (var e = t.target; e && e !== this; e = e.parentNode)
                        if (e.matches(pt)) {
                          yt.call(e, t);
                          break;
                        }
                    }),
                    jt(e)
                      .then(function(t) {
                        if (t && t.error) throw Error(Et(t.error));
                        F();
                      })
                      .catch(function(t) {
                        F(),
                          console.error(
                            "Persistent cart errors or messages: ",
                            Et(t)
                          );
                      }),
                    (function(t) {
                      var r = window.ShopifyAPI;
                      if (r && r.addItemFromForm) {
                        var o = r.addItemFromForm;
                        r.addItemFromForm = function() {
                          for (
                            var t = arguments.length, r = Array(t), i = 0;
                            i < t;
                            i++
                          )
                            r[i] = arguments[i];
                          var u = r.map(function(t) {
                            return "function" == typeof t
                              ? ((n = t),
                                function() {
                                  for (
                                    var t = arguments.length,
                                      r = Array(t),
                                      o = 0;
                                    o < t;
                                    o++
                                  )
                                    r[o] = arguments[o];
                                  var i = r.find(function(t) {
                                    return (
                                      (function(t) {
                                        if (
                                          !(function(t) {
                                            return !!t && "object" == typeof t;
                                          })(t) ||
                                          "[object Object]" != it.call(t) ||
                                          (function(t) {
                                            var e = !1;
                                            if (
                                              null != t &&
                                              "function" != typeof t.toString
                                            )
                                              try {
                                                e = !!(t + "");
                                              } catch (t) {}
                                            return e;
                                          })(t)
                                        )
                                          return !1;
                                        var e = ut(t);
                                        if (null === e) return !0;
                                        var n =
                                          rt.call(e, "constructor") &&
                                          e.constructor;
                                        return (
                                          "function" == typeof n &&
                                          n instanceof n &&
                                          nt.call(n) == ot
                                        );
                                      })(t) &&
                                      "variant_id" in t &&
                                      "quantity" in t
                                    );
                                  });
                                  return (
                                    i &&
                                      ((N.currentCartCount += i.quantity),
                                      jt(e)),
                                    n.apply(void 0, r)
                                  );
                                })
                              : t;
                            var n;
                          });
                          return o.apply(void 0, n(u));
                        };
                      }
                    })();
                var e, r;
              })
              .catch(function(t) {
                throw Error("Persistent cart not responding: " + Et(t));
              })
          : (k() && (tt(), at(0)), R(A), x()));
  });
})();
