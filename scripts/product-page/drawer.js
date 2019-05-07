/**
 * Drawer Module
 *
 * Controls the opening/closing of the drawer UI.
 */

import { IS_ACTIVE_CLASS, JS_PREFIX, FIXED_CLASS } from './constants';

/**
 * Module state
 */
let state = {
  // Keeps track if drawer is open
  isOpen: false,
  // The element ID of the drawer to perform actions on
  drawerId: null
};

/**
 * Module constants
 */
const CLICK_EVENT = 'click';
const TOGGLE_SELECTOR = `.${JS_PREFIX}Drawer-toggle`;
const MAIN_CONTENT_WRAP_SELECTOR = `.${JS_PREFIX}Drawer-wrap`;

/**
 * Handles UI updates for the drawer
 *
 * @param {Object} obj The new UI state
 * @param {boolean} obj.isOpen The new `isOpen` UI state
 * @param {Element} obj.drawerId The drawer element ID to perform actions on
 */
const updateUI = ({ isOpen, drawerId }) => {
  // Update the drawer UI state
  const drawerEl = document.getElementById(drawerId);
  if (drawerEl) {
    drawerEl.classList.toggle(IS_ACTIVE_CLASS, isOpen);
  }

  // Update the content wrapper UI state
  [...document.querySelectorAll(MAIN_CONTENT_WRAP_SELECTOR)].forEach(wrap => {
    wrap.classList.toggle(FIXED_CLASS, isOpen);
  });
};

/**
 * Helper to calculate the `isOpen` state value
 *
 * Anything other than "open" will return `false`.
 *
 * @param {string} action The action to take when toggling ("open"/"close")
 * @returns {boolean} Is the action set to "open"?
 */
const getIsOpen = action => action.trim().toLowerCase() === 'open';

/**
 * Handler for the toggle action
 *
 * @param {Object} event The event object
 */
const toggleHandler = function(event) {
  event.preventDefault();

  const { drawerAction, drawerId } = event.currentTarget.dataset;

  // Update module state
  state = {
    ...state,
    isOpen: getIsOpen(drawerAction),
    drawerId
  };

  // Update module UI with new state
  updateUI(state);
};

/**
 * Initializes Drawer functionality
 */
export const init = () => {
  // Set up toggles
  [...document.querySelectorAll(TOGGLE_SELECTOR)].forEach(toggle => {
    toggle.addEventListener(CLICK_EVENT, toggleHandler);
  });
};
