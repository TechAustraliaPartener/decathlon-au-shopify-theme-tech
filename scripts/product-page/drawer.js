/**
 * Drawer Module
 *
 * Controls the opening/closing of the drawer UI.
 */

import { IS_ACTIVE_CLASS, JS_PREFIX, FIXED_CLASS } from './constants';

/**
 * A module state helper
 *
 * @todo Possibly abstract this into utility to be used by other modules?
 */
const moduleState = (() => {
  /**
   * Default empty state
   */
  let state = {};

  /**
   * Helper to access the module state
   *
   * @returns {Object} The module state
   */
  const getState = () => state;

  /**
   * Helper to update the module state
   *
   * @param {Object} newState The new state
   */
  const setState = newState => {
    state = {
      ...state,
      ...newState
    };
  };

  return {
    getState,
    setState
  };
})();

/**
 * Module constants
 */
const MODULE_NAME = 'Drawer';
const CLICK_EVENT = 'click';
const KEY_DOWN_EVENT = 'keydown';
// @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
const ESCAPE_KEY_VALUE = 'escape';
const OPEN_ACTION = 'open';
const TOGGLE_SELECTOR = `.${JS_PREFIX}${MODULE_NAME}-toggle`;
const MAIN_CONTENT_WRAP_SELECTOR = `.${JS_PREFIX}${MODULE_NAME}-wrap`;

/**
 * Module state defaults
 *
 * @param {Object} state
 * @param {boolean} state.isOpen Keeps track of drawer "open" state
 * @param {string} state.drawerId ID of current drawer to perform actions on
 * @param {Element} state.lastOpenToggleEl Toggle that last opened the drawer
 * @param {NodeList} state.wrapperEls Main content wrapper elements
 */
const DEFAULT_MODULE_STATE = {
  isOpen: false,
  drawerId: null,
  lastOpenToggleEl: null,
  wrapperEls: null
};

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
 * The keyboard event handler
 *
 * @param {KeyboardEvent} keyboardEvent
 */
const keyboardEventHandler = keyboardEvent => {
  /**
   * For better accessibility, the drawer should close via the "escape" key
   */
  if (keyboardEvent.key.toLowerCase() === ESCAPE_KEY_VALUE) {
    // Update the module state to a "closed" state
    moduleState.setState({
      isOpen: false
    });

    // Render the UI with the new state
    render(moduleState.getState());
  }
};

/**
 * Updates the key event listeners depending on the state
 *
 * @param {Object} state The state data object
 * @param {boolean} state.isOpen Whether the drawer is open or not
 */
const updateKeyListeners = ({ isOpen }) => {
  if (isOpen) {
    document.addEventListener(KEY_DOWN_EVENT, keyboardEventHandler);
  } else {
    document.removeEventListener(KEY_DOWN_EVENT, keyboardEventHandler);
  }
};

/**
 * Handles UI updates for the drawer
 *
 * @param {Object} obj The new UI state
 * @param {boolean} obj.isOpen The new `isOpen` UI state
 * @param {string} obj.drawerId The drawer element ID to perform actions on
 * @param {Element} obj.lastOpenToggleEl The last toggle that opened the drawer
 * @param {NodeList} obj.wrapperEls A NodeList of main content wrapper elements
 */
const updateUI = ({ isOpen, drawerId, lastOpenToggleEl, wrapperEls }) => {
  const drawerEl = document.getElementById(drawerId);

  // No need to run any further logic if we have no drawer to work with
  if (!drawerEl) {
    return;
  }

  // Add/remove CSS drawer transitions
  drawerEl.classList.toggle(IS_ACTIVE_CLASS, isOpen);

  // For better accessibility...
  if (isOpen) {
    // ...set the focus on the "close" toggle within the drawer
    const closeToggle = document.querySelector(
      `#${drawerId} ${TOGGLE_SELECTOR}`
    );
    if (closeToggle) {
      closeToggle.focus();
    }
  } else if (lastOpenToggleEl) {
    // ...or set the focus back onto the "open" toggle that opened the drawer
    lastOpenToggleEl.focus();
  }

  // Update the content wrapper UI state
  [...wrapperEls].forEach(wrap => {
    wrap.classList.toggle(FIXED_CLASS, isOpen);
  });
};

/**
 * Handle all UI and listener updates based on the provided state
 *
 * @param {Object} state The state to render against
 */
const render = state => {
  updateUI(state);
  updateKeyListeners(state);
};

/**
 * Handler for the toggle action
 *
 * @param {Object} event The event object
 */
const toggleHandler = function(event) {
  event.preventDefault();

  const { drawerAction, drawerId } = event.currentTarget.dataset;

  const isOpen = isActionOpen(drawerAction);

  const newState = {
    isOpen,
    drawerId
  };

  if (isOpen) {
    newState.lastOpenToggleEl = event.currentTarget;
  }

  // Update the module state
  moduleState.setState(newState);

  // Render all UI updates based on new state
  render(moduleState.getState());
};

/**
 * Initializes Drawer functionality
 */
export const init = () => {
  moduleState.setState({
    ...DEFAULT_MODULE_STATE,
    // Get all content wrapper elements
    wrapperEls: document.querySelectorAll(MAIN_CONTENT_WRAP_SELECTOR)
  });

  // Set up toggles
  [...document.querySelectorAll(TOGGLE_SELECTOR)].forEach(toggle => {
    toggle.addEventListener(CLICK_EVENT, toggleHandler);
  });
};
