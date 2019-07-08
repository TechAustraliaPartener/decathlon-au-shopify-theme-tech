/**
 * Drawer Module
 *
 * Controls the opening/closing of the drawer UI. For accessibility purposes,
 * the Drawer module is treated as a Dialog.
 * @see https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal
 */

import {
  IS_ACTIVE_CLASS,
  HIDE_OVERFLOW_Y_CLASS,
  JS_PREFIX,
  FIXED_CLASS,
  CSS_PREFIX
} from './constants';
import { toggleAttributeValue } from '../utilities/toggle-attribute-value';
import {
  updateFocusableEls,
  trapFocus,
  init as initFocusTrap
} from './focus-trap';
import { createState } from './create-state';

/**
 * Module constants
 */
const MODULE_NAME = 'Drawer';
const CLICK_EVENT = 'click';
const KEY_DOWN_EVENT = 'keydown';
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
 * Using a lowercase version to test against, default values are uppercased.
 */
const ESCAPE_KEY_VALUE = 'escape';
const OPEN_ACTION = 'open';
const STATE_PREFIX = `${CSS_PREFIX}is-`;
const DRAWER_PREFIX = `${MODULE_NAME}-`;
const TOGGLE_SELECTOR = `.${JS_PREFIX}${DRAWER_PREFIX}toggle`;
const OVERLAY_SELECTOR = `.${JS_PREFIX}${DRAWER_PREFIX}overlay`;
const MAIN_CONTENT_WRAP_SELECTOR = `.${JS_PREFIX}${DRAWER_PREFIX}wrap`;
const DRAWER_IN_FLOW_CLASS = `${STATE_PREFIX}inPageFlow`;
const IS_OPEN_CLASS = `${STATE_PREFIX}open`;
const IS_OPENING_CLASS = `${STATE_PREFIX}opening`;
export const IS_CLOSED_CLASS = `${STATE_PREFIX}closed`;
const IS_CLOSING_CLASS = `${STATE_PREFIX}closing`;
const IS_DRAWER_OPEN_CLASS = `${STATE_PREFIX}drawerOpen`;
/**
 * TRANSITION_DURATION value must match (in milliseconds) the value in associated
 * CSS for transition duration ($transition-speed-normal)
 *
 * @see assets/product.scss.liquid
 */
const TRANSITION_DURATION = 200;
/**
 * Module state defaults
 *
 * @param {Object} state
 * @param {string} state.module The name of the module
 * @param {boolean} state.isOpen Keeps track of drawer "open" state
 + @param {Element} state.drawerEl The current drawer element to perform actions on
 * @param {Element} state.lastOpenToggleEl Toggle that last opened the drawer
 * @param {NodeList} state.wrapperEls Main content wrapper elements
 */
const DEFAULT_MODULE_STATE = {
  module: MODULE_NAME,
  isOpen: false,
  drawerEl: null,
  lastOpenToggleEl: null,
  wrapperEls: null,
  htmlEl: null,
  windowScrollPosition: 0
};
/**
 * Reference to the `createState` helper. The `createState`
 * helper assists to create, update and get module state.
 * @see scripts/product-page/create-state.js
 */
let stateHelper;

/**
 * Helper to confirm if the given action is "open"
 *
 * Anything other than "open" will return `false`.
 *
 * @param {string} action The toggle action in question ("open"/"close")
 * @returns {boolean} Is the action set to "open"?
 */
const isActionOpen = action => action.trim().toLowerCase() === OPEN_ACTION;

/**
 * Helper for detecting the "Escape" keyboard key
 *
 * @param {string} key A keyboard event `key`
 * @returns {boolean}
 */
const isEscapeKey = key => key.toLowerCase() === ESCAPE_KEY_VALUE;

/**
 * The keyboard event handler
 *
 * @param {KeyboardEvent} keyboardEvent
 */
const keyboardEventHandler = keyboardEvent => {
  const { key } = keyboardEvent;

  /**
   * For better accessibility, the drawer should close via the "escape" key
   */
  if (isEscapeKey(key)) {
    // Update the module state to a "closed" state
    stateHelper.updateState({
      isOpen: false
    });

    // Render the UI with the new state
    render(stateHelper.getState());
  }

  // Handles trapping the tab focus within the open dialog
  trapFocus(keyboardEvent);
};

/**
 * Updates the keyboard event listeners depending on the state
 *
 * @param {Object} state The state data object
 * @param {boolean} state.isOpen Whether the drawer is open or not
 */
const updateKeyboardListeners = ({ isOpen }) => {
  if (isOpen) {
    document.addEventListener(KEY_DOWN_EVENT, keyboardEventHandler);
  } else {
    document.removeEventListener(KEY_DOWN_EVENT, keyboardEventHandler);
  }
};

/**
 * Toggle or update classes on the drawer when applied to content that also
 * appears in page flow when the drawer is closed
 *
 * @param {Object} params
 * @param {HTMLElement} params.drawerEl - The drawer component element
 * @param {boolean} params.isOpen - Whether the action being handled is to open the
 * drawer
 */
const inFlowDisplayStateChangeUpdates = ({ drawerEl, isOpen }) => {
  drawerEl.classList.toggle(DRAWER_IN_FLOW_CLASS, !isOpen);
  toggleAttributeValue({
    el: drawerEl,
    name: 'role',
    value: 'dialog',
    remove: !isOpen
  });
};

/**
 * Get the window y-axis scroll position, storing to state
 */
const updateWindowScrollPosition = () =>
  stateHelper.updateState({
    windowScrollPosition: window.pageYOffset
  });

/**
 * Set the window y-axis scroll position from state
 *
 * Note the conditional use of `document.documentElement`, `document.body`, or `window.scrollTo`
 * `document.documentElement.scrollTop` is for IE
 * `document.body.scrollTop` is for Chrome, Safari, and Opera
 * `window.scrollTo` is for Firefox
 */
const setWindowScrollPosition = () => {
  const { windowScrollPosition } = stateHelper.getState();
  if (typeof window.scrollTo === 'function') {
    window.scrollTo(0, windowScrollPosition);
  } else {
    const scrollEl = document.documentElement || document.body;
    scrollEl.scrollTop = windowScrollPosition;
  }
};

/**
 * Toggle or otherwise update classes on the drawer and drawer content
 * @param {Object} params
 * @param {Element} params.drawerEl - The drawer component element
 * @param {boolean} params.isOpen - Whether the action being handled is to open the
 * drawer
 * @param {NodeList} params.wrapperEls A NodeList of main content wrapper elements
 */
const updateBaseDrawerClasses = ({ drawerEl, isOpen, wrapperEls }) => {
  /**
   * Toggle fixed positioning on the wrapper(s) of the drawer, to prevent
   * scrolling content outside the drawer
   */
  [...wrapperEls].forEach(wrap => {
    wrap.classList.toggle(FIXED_CLASS, isOpen);
  });
  /**
   * Add or remove an active class to the drawer
   */
  drawerEl.classList.toggle(IS_ACTIVE_CLASS, isOpen);
};

/**
 * Updates for accessibility on opening and closing the drawer
 * @param {Object} params
 * @param {Element} params.drawerEl - The drawer component element
 * @param {Element} params.lastOpenToggleEl The last toggle that opened the drawer
 * @param {boolean} params.isOpen - Whether the action being handled is to open the
 * drawer
 */
const updateAccessibilityState = ({ drawerEl, isOpen, lastOpenToggleEl }) => {
  const closeToggle = document.querySelector(
    `#${drawerEl.id} ${TOGGLE_SELECTOR}`
  );

  /**
   * For accessibility, set the focus on the close toggle for an open
   * drawer or the last-used drawer-open toggle if the drawer is closing
   */
  isOpen && closeToggle && closeToggle.focus();
  !isOpen && lastOpenToggleEl && lastOpenToggleEl.focus();
};

/**
 * Base updates needed on opening or closing the drawer, separate from those
 * needed for a drawer with content that also displays in page flow
 * @param {Object} state
 * @param {Element} state.drawerEl - The drawer component element
 * @param {boolean} state.isOpen - Whether the action being handled
 * is to open the drawer
 * @param {Element} state.lastOpenToggleEl The last toggle that opened the drawer
 * @param {NodeList} state.wrapperEls A NodeList of main content wrapper elements
 * drawer
 */
const baseStateChangeUpdates = ({
  drawerEl,
  isOpen,
  lastOpenToggleEl,
  wrapperEls
}) => {
  updateBaseDrawerClasses({ drawerEl, isOpen, wrapperEls });
  updateAccessibilityState({ drawerEl, isOpen, lastOpenToggleEl });
};

/**
 * Timed updates of transition-related classes on the drawer
 *
 * IIFE wraps returned function and provides timeout placeholder variables
 * in closure
 *
 * @param {Object} state
 * @param {Element} state.drawerEl - The drawer component element
 * @param {Element} state.htmlEl - The HTML (root) element, which needs
 * to have a class set when the drawer is open to avoid double y-axis scrollbars
 * @param {boolean} state.isOpen - Whether the action being handled
 * is to open the drawer
 */
const setDrawerTransitionStates = (() => {
  let openTimeout = null;
  let closeTimeout = null;
  const closeStateCssClasses = [IS_CLOSED_CLASS, IS_CLOSING_CLASS];
  const openStateCssClasses = [IS_OPEN_CLASS, IS_OPENING_CLASS];
  return function _setDrawerTransitionStates({ drawerEl, htmlEl, isOpen }) {
    if (isOpen) {
      closeTimeout && clearTimeout(closeTimeout);
      drawerEl.classList.remove(...closeStateCssClasses, IS_OPEN_CLASS);
      drawerEl.classList.add(IS_OPENING_CLASS);
      openTimeout = setTimeout(() => {
        drawerEl.classList.remove(IS_OPENING_CLASS, ...closeStateCssClasses);
        drawerEl.classList.add(IS_OPEN_CLASS);
        /**
         * Avoid double vertical scroll bars when drawer is open
         * by removing overflow on the root element
         */
        htmlEl.classList.add(HIDE_OVERFLOW_Y_CLASS);
      }, TRANSITION_DURATION);
    } else {
      openTimeout && clearTimeout(openTimeout);
      drawerEl.classList.remove(...openStateCssClasses, IS_CLOSED_CLASS);
      drawerEl.classList.add(IS_CLOSING_CLASS);
      closeTimeout = setTimeout(() => {
        drawerEl.classList.remove(IS_CLOSING_CLASS, ...openStateCssClasses);
        drawerEl.classList.add(IS_CLOSED_CLASS);
      }, TRANSITION_DURATION);
      /**
       * Modify the point at which `overflow-y: scroll` is added back to
       * the `html` (root) element, to avoid visible repositioning of page
       * elements when the page scrollbar reappears
       */
      setTimeout(() => {
        htmlEl.classList.remove(HIDE_OVERFLOW_Y_CLASS);
        // Sets the window scroll position, referenced from state
        setWindowScrollPosition();
      }, TRANSITION_DURATION / 4);
    }
  };
})();

/**
 * Set or unset a class on UI wrapper elements indicating the drawer is
 * in some state of transition
 * @see `assets/product-collapse.scss.liquid`
 * @param {Object} state - UI state
 * @param {NodeList} state.wrapperEls - Wrappers that should be aware of drawer state
 */
const setDrawerInTransitionOnWrapper = (
  { wrapperEls },
  inTransition = true
) => {
  const classListMethod = inTransition ? 'add' : 'remove';
  [...wrapperEls].forEach(el =>
    el.classList[classListMethod](IS_DRAWER_OPEN_CLASS)
  );
};

/**
 * Helper to unset a class on UI wrapper elements indicating the drawer is
 * no longer in some state of transition
 * @param {Object} state
 */
const unsetDrawerInTransitionOnWrapper = state =>
  setDrawerInTransitionOnWrapper(state, false);

/**
 * Handles UI updates for the drawer
 * Forks behavior and staggers timing for updates with drawers that display
 * content that is also shown in page flow
 *
 * IIFE wraps returned function and provides timeout placeholder variables
 * in closure
 *
 * @param {Object} state The new UI state
 */
const updateUI = (() => {
  let baseStateChangeTimeout = null;
  let inFlowDisplayStateChangeTimeout = null;
  return function _updateUI(state) {
    const { isOpen, drawerEl } = state;
    const displaysInPageFlow = drawerEl.dataset.displayInPageFlow;
    setDrawerTransitionStates(state);
    /**
     * If the drawer is opening ...
     */
    if (isOpen) {
      setDrawerInTransitionOnWrapper(state);
      inFlowDisplayStateChangeTimeout &&
        clearTimeout(inFlowDisplayStateChangeTimeout);
      /**
       * ... and is set to show content that also appears in page flow ...
       */
      if (displaysInPageFlow) {
        /**
         * Toggle in-flow-display drawer classes, then use a timeout set to the
         * default transition duration to apply other class updates to the drawer
         * and its content
         */
        inFlowDisplayStateChangeUpdates(state);
        baseStateChangeTimeout = setTimeout(() => {
          baseStateChangeUpdates(state);
        }, TRANSITION_DURATION);
      } else {
        /**
         * ... Otherwise, just update the base set of drawer classes ...
         */
        baseStateChangeUpdates(state);
      }
      /**
       * ... or, if the drawer is closing ...
       */
    } else {
      baseStateChangeTimeout && clearTimeout(baseStateChangeTimeout);
      /**
       * ... update the base set of drawer classes ...
       */
      baseStateChangeUpdates(state);
      /**
       * ... and if the drawer is set to show content that also appears in page
       * flow, use a timeout set to the default transition duration to update
       * in-flow-display drawer classes
       */
      if (displaysInPageFlow) {
        inFlowDisplayStateChangeTimeout = setTimeout(() => {
          inFlowDisplayStateChangeUpdates(state);
          unsetDrawerInTransitionOnWrapper(state);
        }, TRANSITION_DURATION);
      } else {
        unsetDrawerInTransitionOnWrapper(state);
      }
    }
  };
})();

/**
 * Handle all UI and listener updates based on the provided state
 *
 * @param {Object} state The state to render against
 */
const render = state => {
  updateUI(state);
  updateKeyboardListeners(state);
};

/**
 * Handler for the toggle action
 *
 * @param {Object} event The event object
 */
const toggleHandler = function(event) {
  event.preventDefault();

  const { drawerAction, drawerId } = event.currentTarget.dataset;

  const drawerEl = document.getElementById(drawerId);

  // No need to run any further logic if we have no drawer to work with
  if (!drawerEl) {
    return;
  }

  const isOpen = isActionOpen(drawerAction);

  const newState = {
    isOpen,
    drawerEl
  };

  if (isOpen) {
    newState.lastOpenToggleEl = event.currentTarget;
    // Let the FocusTrap module update the first/last focusable elements
    updateFocusableEls(drawerId);
    // Captures the window scroll position, saving it to state
    updateWindowScrollPosition();
  }

  // Update the module state
  stateHelper.updateState(newState);

  // Render all UI updates based on new state
  render(stateHelper.getState());
};

/**
 * Initialize Drawer toggles
 *
 * @param {Element} toggle Drawer toggle element to initialize
 */
const initToggle = toggle => {
  /**
   * `<a>` toggle elements are progressively-enhanced by JS and should
   * be treated as buttons when accessing the UI via screen readers.
   */
  if (toggle.tagName.toLowerCase() === 'a') {
    toggle.setAttribute('role', 'button');
  }
  /**
   * JS progressively-enhanced toggles have aria-labels added to them for
   * a better UX when accessed via screen readers.
   */
  const ariaLabel = toggle.dataset.drawerToggleAriaLabel;
  if (ariaLabel) {
    toggle.setAttribute('aria-label', ariaLabel);
    // This is cleanup, no longer needed once JS takes over.
    toggle.removeAttribute('data-drawer-toggle-aria-label');
  }

  toggle.addEventListener(CLICK_EVENT, toggleHandler);
};

/**
 * Initialize Drawer
 */
export const init = () => {
  stateHelper = createState({
    ...DEFAULT_MODULE_STATE,
    // Get all content wrapper elements
    wrapperEls: document.querySelectorAll(MAIN_CONTENT_WRAP_SELECTOR),
    htmlEl: document.querySelector('html')
  });

  // Initialize toggles
  [
    ...document.querySelectorAll(`${TOGGLE_SELECTOR}, ${OVERLAY_SELECTOR}`)
  ].forEach(initToggle);

  // Initialize the FocusTrap module
  initFocusTrap();
};
