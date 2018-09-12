(function ($) {
  'use strict';

  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;

  /**
   * polyfill for document.scrollingElement
   * https://github.com/yangg/scrolling-element
   */
  (function () {
    if (document.scrollingElement) {
      return;
    }
    var element = null;
    function scrollingElement() {
      if (element) {
        return element;
      } else if (document.body.scrollTop) {
        // speed up if scrollTop > 0
        return element = document.body;
      }
      var iframe = document.createElement('iframe');
      iframe.style.height = '1px';
      document.documentElement.appendChild(iframe);
      var doc = iframe.contentWindow.document;
      doc.write('<!DOCTYPE html><div style="height:9999em">x</div>');
      doc.close();
      var isCompliant = doc.documentElement.scrollHeight > doc.body.scrollHeight;
      iframe.parentNode.removeChild(iframe);
      return element = isCompliant ? document.documentElement : document.body;
    }
    Object.defineProperty(document, 'scrollingElement', {
      get: scrollingElement
    });
  })();

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var NAME = 'collapsible';
  var DATA_KEY = 'de.' + NAME;
  var EVENT_KEY = '.' + DATA_KEY;
  var ATTR_PREFIX = 'data-de-' + NAME;

  var ClassName = {
    COLLAPSED: 'de-is-collapsed'
  };

  var EventName = {
    CLICK: 'click' + EVENT_KEY,
    HIDE: 'hide' + EVENT_KEY,
    HIDDEN: 'hidden' + EVENT_KEY,
    SHOW: 'show' + EVENT_KEY,
    SHOWN: 'shown' + EVENT_KEY
  };

  var Default = {
    actionAttr: ATTR_PREFIX + '-action',
    defaultAction: 'toggle',
    parent: null,
    targetAttr: ATTR_PREFIX + '-target'
  };

  /**
   * Class representing a single, collapsible element.
   *
   * @todo Consider adding key listener for non-button toggles.
   * @todo Consider adopting more tab-specific ARIA roles and attributes when a
   * parent element is specified.
   * @todo Consider potential animation techniques.
   */

  var Collapsible = function () {
    /**
     * Create a collapsible.
     *
     * @param {*} element - A valid jQuery element or selector representing the
     * element that may be collapsed.
     * @param {Object} [settings] - Configuration settings.
     * @param {String} [settings.actionAttr] - Attribute to use to determine what
     * action toggle elements should take.
     * @param {String} [settings.defaultAction=toggle] - Default action for toggle
     * elements to perform on click.
     * @param {*} [settings.parent] - Parent element to use to manage visibility
     * of siblings.
     * @param {String} [settings.targetAttr] - Attribute to use to associate
     * toggle elements with this.
     */

    function Collapsible(element, settings) {
      var _this = this;

      classCallCheck(this, Collapsible);

      this._element = $(element);
      this._settings = settings;
      this._id = this._element.attr('id');
      this._state = {
        collapsed: this._element.hasClass(ClassName.COLLAPSED),
        transitioning: false
      };

      this._controlElements = $(this._id && '[' + this._settings.targetAttr + '="' + this._id + '"]').each(function (_index, element) {
        return _this._initControl(element);
      });

      this._parentElement = $(this._settings.parent && '#' + this._settings.parent);
      this._siblingElements = $();

      if (this._parentElement.length > 0) {
        var siblingElements = this._parentElement.find('[data-parent="' + this._parentElement.attr('id') + '"]');
        var firstVisibleSibling = siblingElements.not('.' + ClassName.COLLAPSED).first();
        this._siblingElements = this._siblingElements.add(siblingElements.not(this._element));

        if (firstVisibleSibling.is(this._element)) {
          this._hideSiblings();
        }
      }

      this._updateAria();
    }

    /**
     * Toggle the element's visibility.
     *
     * @param {Boolean} [state] - `true` to show, `false` to hide. Defaults to the
     * inverse of the current state.
     */

    createClass(Collapsible, [{
      key: 'toggle',
      value: function toggle(state) {
        if (state === undefined) {
          state = this._state.collapsed;
        }

        if (state) {
          this.show();
        } else {
          this.hide();
        }
      }

      /**
       * Show the element.
       */

    }, {
      key: 'show',
      value: function show() {
        if (this._state.transitioning || !this._state.collapsed) return;

        this._element.trigger(EventName.SHOW);
        this._state.transitioning = true;
        this._hideSiblings();

        this._element.removeClass(ClassName.COLLAPSED);
        this._state.collapsed = false;
        this._updateAria();
        this._state.transitioning = false;
        this._element.trigger(EventName.SHOWN);
      }

      /**
       * Hide (collapse) the element.
       */

    }, {
      key: 'hide',
      value: function hide() {
        if (this._state.transitioning || this._state.collapsed) return;

        this._element.trigger(EventName.HIDE);
        this._state.transitioning = true;
        this._element.addClass(ClassName.COLLAPSED);
        this._state.collapsed = true;
        this._updateAria();
        this._state.transitioning = false;
        this._element.trigger(EventName.HIDDEN);
      }

      /**
       * Hide visible siblings (if any).
       *
       * @protected
       */

    }, {
      key: '_hideSiblings',
      value: function _hideSiblings() {
        var visibleSiblings = this._siblingElements.not('.' + ClassName.COLLAPSED);

        if (visibleSiblings.length > 0) {
          Collapsible._jQueryInterface.call(visibleSiblings, 'hide');
        }
      }

      /**
       * Initializes a control and, based on its target and action, any events, ARIA
       * properties, etc.
       *
       * @param {*} element
       * @protected
       */

    }, {
      key: '_initControl',
      value: function _initControl(element) {
        var _this2 = this;

        element = $(element).attr('aria-controls', this._id);
        var method = element.attr(this._settings.actionAttr) || this._settings.defaultAction;

        if (this[method] === undefined) {
          throw new Error('No method named "' + method + '"');
        }

        element.on(EventName.CLICK, function (event) {
          if (element.is('a')) {
            event.preventDefault();
          }

          _this2[method]();
        });
      }

      /**
       * Update ARIA attributes for the main element and any control elements based
       * on the current state.
       *
       * @protected
       */

    }, {
      key: '_updateAria',
      value: function _updateAria() {
        this._element.attr('aria-hidden', this._state.collapsed ? 'true' : 'false');
        this._controlElements.attr('aria-expanded', this._state.collapsed ? 'false' : 'true');
        this._controlElements.filter('[' + this._settings.actionAttr + '="show"]').attr('aria-disabled', this._state.collapsed ? 'false' : 'true');
        this._controlElements.filter('[' + this._settings.actionAttr + '="hide"]').attr('aria-disabled', this._state.collapsed ? 'true' : 'false');
      }

      /**
       * A jQuery interface to enable usage of this class as a plugin. Checks for
       * an existing class instance and only creates a new one if it isn't present.
       * Methods can be called by passing them as the first argument.
       *
       * @static
       * @protected
       * @param {(Object|String)} [config] - Either a configuration object to pass
       * along directly to the class, or a string representing the method name to
       * call.
       * @param {...*} [args] - One or more arguments to pass along to a method.
       * @returns {jQuery}
       * @example
       * // Instantiate with no visibility change
       * $('#example').collapsible();
       * // Instantiate with options
       * $('#example').collapsible({
       *   parent: '#parent'
       * });
       * // Toggle
       * $('#example').collapsible('toggle');
       * // Show
       * $('#example').collapsible('show');
       * $('#example').collapsible('toggle', true);
       * // Hide
       * $('#example').collapsible('hide');
       * $('#example').collapsible('toggle', false);
       */

    }], [{
      key: '_jQueryInterface',
      value: function _jQueryInterface(config) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return this.each(function () {
          var $this = $(this);
          var data = $this.data(DATA_KEY);
          var _config = $.extend({}, Default, $this.data(), (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object' && config);

          if (!data) {
            data = new Collapsible(this, _config);
            $this.data(DATA_KEY, data);
          }

          if (typeof config === 'string') {
            var _data;

            if (data[config] === undefined) {
              throw new Error('No method named "' + config + '"');
            }

            (_data = data)[config].apply(_data, args);
          }
        });
      }
    }]);
    return Collapsible;
  }();
  $.fn[NAME] = Collapsible._jQueryInterface;

  /* eslint-disable no-undefined,no-param-reassign,no-shadow */

  /**
   * Throttle execution of a function. Especially useful for rate limiting
   * execution of handlers on events like resize and scroll.
   *
   * @param  {Number}    delay          A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
   * @param  {Boolean}   [noTrailing]   Optional, defaults to false. If noTrailing is true, callback will only execute every `delay` milliseconds while the
   *                                    throttled-function is being called. If noTrailing is false or unspecified, callback will be executed one final time
   *                                    after the last throttled-function call. (After the throttled-function has not been called for `delay` milliseconds,
   *                                    the internal counter is reset)
   * @param  {Function}  callback       A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
   *                                    to `callback` when the throttled-function is executed.
   * @param  {Boolean}   [debounceMode] If `debounceMode` is true (at begin), schedule `clear` to execute after `delay` ms. If `debounceMode` is false (at end),
   *                                    schedule `callback` to execute after `delay` ms.
   *
   * @return {Function}  A new, throttled, function.
   */
  function throttle(delay, noTrailing, callback, debounceMode) {

  	/*
    * After wrapper has stopped being called, this timeout ensures that
    * `callback` is executed at the proper times in `throttle` and `end`
    * debounce modes.
    */
  	var timeoutID;

  	// Keep track of the last time `callback` was executed.
  	var lastExec = 0;

  	// `noTrailing` defaults to falsy.
  	if (typeof noTrailing !== 'boolean') {
  		debounceMode = callback;
  		callback = noTrailing;
  		noTrailing = undefined;
  	}

  	/*
    * The `wrapper` function encapsulates all of the throttling / debouncing
    * functionality and when executed will limit the rate at which `callback`
    * is executed.
    */
  	function wrapper() {

  		var self = this;
  		var elapsed = Number(new Date()) - lastExec;
  		var args = arguments;

  		// Execute `callback` and update the `lastExec` timestamp.
  		function exec() {
  			lastExec = Number(new Date());
  			callback.apply(self, args);
  		}

  		/*
     * If `debounceMode` is true (at begin) this is used to clear the flag
     * to allow future `callback` executions.
     */
  		function clear() {
  			timeoutID = undefined;
  		}

  		if (debounceMode && !timeoutID) {
  			/*
      * Since `wrapper` is being called for the first time and
      * `debounceMode` is true (at begin), execute `callback`.
      */
  			exec();
  		}

  		// Clear any existing timeout.
  		if (timeoutID) {
  			clearTimeout(timeoutID);
  		}

  		if (debounceMode === undefined && elapsed > delay) {
  			/*
      * In throttle mode, if `delay` time has been exceeded, execute
      * `callback`.
      */
  			exec();
  		} else if (noTrailing !== true) {
  			/*
      * In trailing throttle mode, since `delay` time has not been
      * exceeded, schedule `callback` to execute `delay` ms after most
      * recent execution.
      *
      * If `debounceMode` is true (at begin), schedule `clear` to execute
      * after `delay` ms.
      *
      * If `debounceMode` is false (at end), schedule `callback` to
      * execute after `delay` ms.
      */
  			timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay);
  		}
  	}

  	// Return the wrapper function.
  	return wrapper;
  }

  /**
   * @see https://stanko.github.io/get-scrollbar-width-in-javascript/
   */

  function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  var NAME$1 = 'pageWrap';
  var DATA_KEY$1 = 'de.' + NAME$1;
  var EVENT_KEY$1 = '.' + DATA_KEY$1;
  var ATTR_PREFIX$1 = 'data-de-page-wrap';

  var ClassName$1 = {
    OPEN: 'de-is-open',
    OPENING: 'de-is-opening',
    EXPANDED: 'de-is-expanded',
    EXPANDING: 'de-is-expanding'
  };

  var EventName$1 = {
    CLICK: 'click' + EVENT_KEY$1,
    MOUSE_ENTER: 'mouseenter' + EVENT_KEY$1,
    MOUSE_LEAVE: 'mouseleave' + EVENT_KEY$1,
    RESIZE: 'resize' + EVENT_KEY$1
  };

  var Default$1 = {
    actionAttr: ATTR_PREFIX$1 + '-action',
    cancelAttr: ATTR_PREFIX$1 + '-cancel',
    hoverAttr: ATTR_PREFIX$1 + '-hover',
    fixAttr: ATTR_PREFIX$1 + '-fix',
    scrollingElement: document.scrollingElement,
    targetAttr: ATTR_PREFIX$1 + '-target',
    throttleDelay: 300,
    transitionDuration: 200
  };

  /**
   * Class representing the `PageWrap` pattern, which wraps a page's content
   * and controls its layout relative to other layout elements.
   *
   * @todo Resolve subtle content flicker on mobile devices.
   * @todo Refactor to allow for multiple menus (not simple on/off states).
   * @todo Refactor animation logic to hook onto `transitionend` events over
   * timeouts.
   * @todo Add option for auto-focusing a form that is exposed within the
   * expanded header content.
   */

  var PageWrap = function () {
    /**
     * Create a PageWrap.
     *
     * @param {*} element - A valid jQuery element or selector, typically
     * representing the document body or topmost `PageGirdle` element.
     * @param {Object} [settings] - Configuration settings.
     * @param {String} [settings.actionAttr] - Attribute used to determine toggle
     * method.
     * @param {String} [settings.cancelAttr] - Attribute for canceling parent
     * events, enabling "click on outside" functionality.
     * @param {String} [settings.hoverAttr] - Attribute for opting into hover
     * interactions for toggles.
     * @param {String} [settings.fixAttr] - Attribute for applying scroll position
     * and scrollbar fixes to an element.
     * @param {String} [settings.scrollingElement=document.scrollingElement] -
     * Valid jQuery element or selector that represents the most appropriate
     * scrollable element for this page and browser. This exists because different
     * browsers use different elements for this.
     * @param {String} [settings.targetAttr] - Attribute for defining the target
     * ID of actionable elements, which is used to maintain ARIA attributes.
     * @param {String} [settings.throttleDelay=300] - Delay for throttling resize
     * event checks for ARIA updating.
     * @param {String} [settings.transitionDuration=200] - Time to wait for
     * transitions to end before considering animations complete.
     */

    function PageWrap(element, settings) {
      var _this = this;

      classCallCheck(this, PageWrap);

      /**
       * Initialize fundamental properties.
       */

      this._element = $(element);
      this._menuElements = $();
      this._settings = settings;
      this._state = {
        open: this._element.hasClass(ClassName$1.OPEN),
        expanded: this._element.hasClass(ClassName$1.EXPANDED),
        transitioning: false
      };

      /**
       * Set up scroll check and fix properties.
       */

      this._scrollingElement = $(this._settings.scrollingElement);
      this._scrollFixElements = this._element.find('[' + this._settings.fixAttr + '~="scroll"]');
      this._scrollbarFixElements = this._element.find('[' + this._settings.fixAttr + '~="bar"]');

      /**
       * Set up control elements (toggles, etc.) and ARIA states.
       */

      this._element.find('[' + this._settings.actionAttr + ']').each(function (_index, element) {
        return _this._initControl(element);
      });

      this._updateAria();

      $(window).on(EventName$1.RESIZE, throttle(this._settings.throttle, function () {
        return _this._updateAria();
      }));
    }

    /**
     * Open the menu if it is closed, or close it if it is open.
     *
     * @param {Boolean} [state] - Optionally set to `true` to open, `false` to
     * close. Defaults to the opposite of the current state.
     */

    createClass(PageWrap, [{
      key: 'toggleMenu',
      value: function toggleMenu(state) {
        if (state === undefined) {
          state = !this._state.open;
        }

        if (state) {
          return this.openMenu();
        }

        this.closeMenu();
      }

      /**
       * Open the menu.
       */

    }, {
      key: 'openMenu',
      value: function openMenu() {
        var _this2 = this;

        if (this._state.open || this._state.transitioning) return;

        this._state.transitioning = true;
        this._fixScroll();
        this._element.addClass(ClassName$1.OPENING);
        this._element.outerWidth() && this._element.addClass(ClassName$1.OPEN);

        setTimeout(function () {
          _this2._updateAria();
          _this2._state.open = true;
          _this2._state.transitioning = false;
        }, this._settings.transitionDuration);
      }

      /**
       * Close the menu.
       */

    }, {
      key: 'closeMenu',
      value: function closeMenu() {
        var _this3 = this;

        if (!this._state.open || this._state.transitioning) return;

        this._state.transitioning = true;
        this._element.removeClass(ClassName$1.OPEN);

        setTimeout(function () {
          _this3._element.removeClass(ClassName$1.OPENING);
          _this3._restoreScroll();
          _this3._updateAria();
          _this3._state.open = false;
          _this3._state.transitioning = false;
        }, this._settings.transitionDuration);
      }

      /**
       * Expand the header if it is collapsed, or collapse it if it is expanded.
       *
       * @param {Boolean} [state] - Optionally set to `true` to expand, `false` to
       * collapse. Defaults to the opposite of the current state.
       */

    }, {
      key: 'toggleExpand',
      value: function toggleExpand(state) {
        if (state === undefined) {
          state = !this._state.expanded;
        }

        if (state) {
          return this.expand();
        }

        this.collapse();
      }

      /**
       * Expand the header.
       */

    }, {
      key: 'expand',
      value: function expand() {
        var _this4 = this;

        if (this._state.expanded || this._state.transitioning) return;

        this._state.transitioning = true;
        this._element.addClass(ClassName$1.EXPANDING);
        this._element.outerWidth() && this._element.addClass(ClassName$1.EXPANDED);

        setTimeout(function () {
          _this4._updateAria();
          _this4._state.expanded = true;
          _this4._state.transitioning = false;
        }, this._settings.transitionDuration);
      }

      /**
       * Collapse the header.
       */

    }, {
      key: 'collapse',
      value: function collapse() {
        var _this5 = this;

        if (!this._state.expanded || this._state.transitioning) return;

        this._state.transitioning = true;
        this._element.removeClass(ClassName$1.EXPANDED);

        setTimeout(function () {
          _this5._element.removeClass(ClassName$1.EXPANDING);
          _this5._updateAria();
          _this5._state.expanded = false;
          _this5._state.transitioning = false;
        }, this._settings.transitionDuration);
      }

      /**
       * When page scrolling is restricted via CSS, one unpleasant side effect is
       * that the page content's scroll position is lost. This method is meant to
       * be called before those CSS changes are applied. It stores the page's
       * scroll position, then applies that as a visual transformation to a child
       * element.
       *
       * It also fetches the scrollbar width and adds it as padding to account for
       * any shifts in that regard.
       *
       * @protected
       */

    }, {
      key: '_fixScroll',
      value: function _fixScroll() {
        this._state.scrollTop = this._scrollingElement.scrollTop();
        this._state.scrollbarWidth = getScrollbarWidth();

        if (this._state.scrollTop) {
          this._scrollFixElements.css('transform', 'translateY(-' + this._state.scrollTop + 'px)');
        }

        if (this._state.scrollbarWidth) {
          this._scrollbarFixElements.css('padding-right', this._state.scrollbarWidth + 'px');
        }
      }

      /**
       * The inverse of `_fixScroll`, clearing the visual transformations and
       * re-applying the scroll position.
       *
       * @protected
       */

    }, {
      key: '_restoreScroll',
      value: function _restoreScroll() {
        if (this._state.scrollbarWidth) {
          this._scrollbarFixElements.css('padding-right', '');
        }

        if (this._state.scrollTop) {
          this._scrollFixElements.css('transform', '');
          this._scrollingElement.scrollTop(this._state.scrollTop);
        }
      }

      /**
       * Initializes a control (such as a toggle or close button) and, based on its
       * action and target, any events, ARIA properties, etc. Targeted menus are
       * added to the `_menuElements` property, which is leveraged by the
       * `_updateAria` method.
       *
       * @param {*} element
       * @protected
       */

    }, {
      key: '_initControl',
      value: function _initControl(element) {
        var _this6 = this;

        element = $(element);
        var action = element.attr(this._settings.actionAttr);
        var targetId = element.attr(this._settings.targetAttr);
        var target = $('#' + targetId);
        var hover = element.attr(this._settings.hoverAttr) === 'true';

        if (target.length === 1) {
          this._menuElements = this._menuElements.add(target);
          element.attr({
            'aria-controls': targetId,
            'aria-haspopup': 'true'
          });
        }

        element.on(EventName$1.CLICK, function (event) {
          if ($(event.target).closest('[' + _this6._settings.cancelAttr + ']').length === 0) {
            _this6[action]();
          }
        });

        if (target.length === 1 && action === 'toggleMenu' && hover) {
          var onLeave = function onLeave() {
            element.add(target).off(EventName$1.MOUSE_LEAVE);
            _this6.closeMenu();
          };

          element.on(EventName$1.MOUSE_ENTER, function (event) {
            _this6.openMenu();

            element.on(EventName$1.MOUSE_LEAVE, function (event) {
              if ($(event.relatedTarget).closest(target).length === 0) {
                onLeave();
              }
            });

            target.on(EventName$1.MOUSE_LEAVE, function (event) {
              if ($(event.relatedTarget).closest(element).length === 0) {
                onLeave();
              }
            });
          });
        }
      }

      /**
       * Loop through all identified menu elements and update associated control
       * properties based on the element's visibility.
       *
       * @protected
       */

    }, {
      key: '_updateAria',
      value: function _updateAria() {
        this._menuElements.each(function (_index, element) {
          element = $(element);
          var id = element.attr('id');
          var isVisible = element.is(':visible');
          $('[aria-controls="' + id + '"]:visible').attr('aria-expanded', isVisible ? 'true' : 'false');
          element.attr('aria-hidden', isVisible ? 'false' : 'true');
        });
      }

      /**
       * A jQuery interface to enable usage of this class as a plugin. Checks for
       * an existing class instance and only creates a new one if it isn't present.
       * Methods can be called by passing them as the first argument.
       *
       * @static
       * @protected
       * @param {(Object|String)} [config] - Either a configuration object to pass
       * along directly to the class, or a string representing the method name to
       * call.
       * @param {...*} [args] - One or more arguments to pass along to a method.
       * @returns {jQuery}
       * @example
       * // Instantiate (optional but usually a good idea)
       * const $body = $('.js-de-PageGirdle').pageWrap();
       * // Call method later
       * $('#toggle').on('click', () => $body.pageWrap('toggleMenu'));
       */

    }], [{
      key: '_jQueryInterface',
      value: function _jQueryInterface(config) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return this.each(function () {
          var $this = $(this);
          var data = $this.data(DATA_KEY$1);
          var _config = $.extend({}, Default$1, $this.data(), (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object' && config);

          if (!data) {
            data = new PageWrap(this, _config);
            $this.data(DATA_KEY$1, data);
          }

          if (typeof config === 'string') {
            var _data;

            if (data[config] === undefined) {
              throw new Error('No method named "' + config + '"');
            }

            (_data = data)[config].apply(_data, args);
          }
        });
      }
    }]);
    return PageWrap;
  }();
  $.fn[NAME$1] = PageWrap._jQueryInterface;

  var NAME$2 = 'slideViews';
  var DATA_KEY$2 = 'de.' + NAME$2;
  var EVENT_KEY$2 = '.' + DATA_KEY$2;
  var ATTR_PREFIX$2 = 'data-de-' + NAME$2;

  var ClassName$2 = {
    INIT: 'de-is-initialized',
    ACTIVE: 'de-is-active',
    POPPING: 'de-is-popping',
    POPPED: 'de-is-popped',
    PUSHING: 'de-is-pushing',
    PUSHED: 'de-is-pushed'
  };

  var EventName$2 = {
    CLICK: 'click' + EVENT_KEY$2,
    TRANSITION_END: 'transitionend' + EVENT_KEY$2
  };

  var Default$2 = {
    views: '.js-de-SlideViews-view',
    actionAttr: ATTR_PREFIX$2 + '-action',
    targetAttr: ATTR_PREFIX$2 + '-target',
    defaultAction: 'push'
  };

  /**
   * @todo Test in IE11, other browsers
   * @todo Add ARIA attr mgmt (see Collapsible and PageWrap for examples)
   * @todo Allow links w/ `href` to specify target ID for fallbacks
   * @todo Add code comments to this component (see Collapsible and PageWrap)
   */

  var SlideViews = function () {
    function SlideViews(element, settings) {
      var _this = this;

      classCallCheck(this, SlideViews);

      this._element = $(element);
      this._settings = settings;
      this._views = this._element.find(this._settings.views);
      this._controls = this._element.find('[' + this._settings.targetAttr + ']');
      this._state = { transitioning: false };

      var activeViews = this._views.filter('.' + ClassName$2.ACTIVE);

      if (activeViews.length > 1) {
        activeViews.not(activeViews.first()).removeClass(ClassName$2.ACTIVE);
      } else if (activeViews.length === 0) {
        this._views.first().addClass(ClassName$2.ACTIVE);
      }

      this._controls.each(function (_index, element) {
        element = $(element);
        var targetId = element.attr(_this._settings.targetAttr);
        var action = element.attr(_this._settings.actionAttr) || _this._settings.defaultAction;
        console.log(_this._settings.targetAttr);
        element.on(EventName$2.CLICK, function () {
          return _this[action]('#' + targetId);
        });
      });

      this._element.addClass(ClassName$2.INIT);
    }

    createClass(SlideViews, [{
      key: 'push',
      value: function push(element) {
        this._slideTo(element);
      }
    }, {
      key: 'pop',
      value: function pop(element) {
        this._slideTo(element, true);
      }
    }, {
      key: '_slideTo',
      value: function _slideTo(toElement, pop) {
        var _this2 = this;

        toElement = $(toElement);

        if (this._state.transitioning || toElement.hasClass(ClassName$2.ACTIVE)) return;

        this._state.transitioning = true;

        var fromElement = this._views.filter('.' + ClassName$2.ACTIVE);
        var fromTransitionClass = pop ? ClassName$2.PUSHING : ClassName$2.POPPING;
        var fromStartClass = pop ? ClassName$2.PUSHED : ClassName$2.POPPED;
        var toTransitionClass = pop ? ClassName$2.POPPING : ClassName$2.PUSHING;
        var toEndClass = pop ? ClassName$2.POPPED : ClassName$2.PUSHED;

        fromElement.addClass(fromStartClass + ' ' + fromTransitionClass);
        toElement.addClass(ClassName$2.ACTIVE + ' ' + toTransitionClass);

        fromElement.on(EventName$2.TRANSITION_END, function (event) {
          if ($(event.target).is(fromElement)) {
            fromElement.off(EventName$2.TRANSITION_END);
            fromElement.removeClass(ClassName$2.ACTIVE + ' ' + fromTransitionClass + ' ' + fromStartClass);
          }
        });

        toElement.on(EventName$2.TRANSITION_END, function (event) {
          if ($(event.target).is(toElement)) {
            toElement.off(EventName$2.TRANSITION_END);
            toElement.removeClass(toTransitionClass + ' ' + toEndClass);
            _this2._state.transitioning = false;
          }
        });

        fromElement.outerWidth() && fromElement.removeClass(fromStartClass);
        toElement.outerWidth() && toElement.addClass(toEndClass);
      }
    }], [{
      key: '_jQueryInterface',
      value: function _jQueryInterface(config) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return this.each(function () {
          var $this = $(this);
          var data = $this.data(DATA_KEY$2);
          var _config = $.extend({}, Default$2, $this.data(), (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object' && config);

          if (!data) {
            data = new SlideViews(this, _config);
            $this.data(DATA_KEY$2, data);
          }

          if (typeof config === 'string') {
            var _data;

            if (data[config] === undefined) {
              throw new Error('No method named "' + config + '"');
            }

            (_data = data)[config].apply(_data, args);
          }
        });
      }
    }]);
    return SlideViews;
  }();
  $.fn[NAME$2] = SlideViews._jQueryInterface;

  /**
   * Initialize jQuery-powered components
   */

  $('.js-de-Collapsible').collapsible();
  $('.js-de-PageWrap').pageWrap();
  $('.js-de-SlideViews').slideViews();

}(jQuery));
