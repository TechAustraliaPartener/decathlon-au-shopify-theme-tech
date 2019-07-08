/**
 * Focus Trap Module
 *
 * UI tab focus trap helper for a given parent dialog element.
 * Intended to be used with modal dialogs when open.
 *
 * @see https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal
 * @see https://bitsofco.de/accessible-modal-dialog/#5whileopenpreventtabbingtooutsidethedialog
 */

import { createState } from './create-state';

/**
 * Module constants
 */
const MODULE_NAME = 'FocusTrap';
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
 * Using a lowercase version to test against, default values are uppercased.
 */
const TAB_KEY_VALUE = 'tab';
/**
 * Focusable element list borrowed from edenspiekermann/a11y-dialog project
 * @see https://github.com/edenspiekermann/a11y-dialog/blob/cf4ed8155bf8db0336ab556f2e4eafcaebc9e905/a11y-dialog.js#L6-L18
 */
const NOT_INERT_SELECTOR = ':not([inert])';
const NOT_NEGATIVE_TAB_INDEX_SELECTOR = ':not([tabindex^="-"])';
const NOT_DISABLED_SELECTOR = ':not([disabled])';
const FOCUSABLE_ELEMENT_SELECTORS = [
  `a[href]${NOT_NEGATIVE_TAB_INDEX_SELECTOR}${NOT_INERT_SELECTOR}`,
  `area[href]${NOT_NEGATIVE_TAB_INDEX_SELECTOR}${NOT_INERT_SELECTOR}`,
  `input${NOT_DISABLED_SELECTOR}${NOT_INERT_SELECTOR}`,
  `select${NOT_DISABLED_SELECTOR}${NOT_INERT_SELECTOR}`,
  `textarea${NOT_DISABLED_SELECTOR}${NOT_INERT_SELECTOR}`,
  `button${NOT_DISABLED_SELECTOR}${NOT_INERT_SELECTOR}`,
  `iframe${NOT_NEGATIVE_TAB_INDEX_SELECTOR}${NOT_INERT_SELECTOR}`,
  `audio${NOT_NEGATIVE_TAB_INDEX_SELECTOR}${NOT_INERT_SELECTOR}`,
  `video${NOT_NEGATIVE_TAB_INDEX_SELECTOR}${NOT_INERT_SELECTOR}`,
  `[contenteditable]${NOT_NEGATIVE_TAB_INDEX_SELECTOR}${NOT_INERT_SELECTOR}`,
  `[tabindex]${NOT_NEGATIVE_TAB_INDEX_SELECTOR}${NOT_INERT_SELECTOR}`
];
/**
 * Module state defaults
 *
 * @param {Object} state
 * @param {string} state.moduleName The name of the current module,
 *        helpful for debugging
 * @param {Element} state.focusableEls The focusable elements within
 *        the active dialog
 * @param {Element} state.firstFocusableEl The first focusable element within
 *        the active dialog
 * @param {Element} state.lastFocusableEl The last focusable element within
 *        the active dialog
 */
const DEFAULT_MODULE_STATE = {
  module: MODULE_NAME,
  focusableEls: null,
  firstFocusableEl: null,
  lastFocusableEl: null
};

/**
 * Stores the state helper
 */
let stateHelper;

/**
 * Helper for detecting the "Tab" keyboard key
 *
 * @param {string} key A keyboard event `key`
 * @returns {boolean}
 */
const isTabKey = key => key.toLowerCase() === TAB_KEY_VALUE;

/**
 * Helper to retrieve the focusable elements for a given dialog
 *
 * @todo Refactor to work with non-ID values?
 *
 * @param {string} dialogId The ID of the given dialog
 * @return {NodeList} A NodeList of focusable elements for the given dialog
 */
const getFocusableElements = dialogId =>
  document.querySelectorAll(
    FOCUSABLE_ELEMENT_SELECTORS.map(
      selector => `#${dialogId} ${selector}`
    ).join()
  );

/**
 * Helper to find out if multiple focusable elements exist
 *
 * @param {Object} state A state object
 * @param {NodeList} state.focusableEls A NodeList of focusable elements
 */
const hasMultipleFocusableElements = ({ focusableEls }) =>
  focusableEls.length > 1;

/**
 * Updates first/last focusable elements for given dialog
 *
 * Should be called when a new dialog is opened. This allows the FocusTrap
 * module to update the current first/last focusable elements.
 *
 * @param {string} dialogId The ID of the given dialog
 */
export const updateFocusableEls = dialogId => {
  const focusableEls = getFocusableElements(dialogId);

  stateHelper.updateState({
    focusableEls,
    firstFocusableEl: focusableEls[0],
    lastFocusableEl: focusableEls[focusableEls.length - 1]
  });
};

/**
 * Traps the tab focus
 *
 * Uses own FocusTrap module state to know when the first/last focusable
 * element has been tabbed to and resets the focus accordingly.
 *
 * @param {Event} keyboardEvent A keyboard event
 */
export const trapFocus = keyboardEvent => {
  const { key, shiftKey } = keyboardEvent;

  // Scope the focus trap to the "Tab" key event
  if (isTabKey(key)) {
    const state = stateHelper.getState();

    // No need to handle focus resets if there aren't enough focusable elements
    if (!hasMultipleFocusableElements(state)) {
      keyboardEvent.preventDefault();
      return;
    }

    // Handle forward (Tab) and backward (Shift + Tab) tabbing
    if (shiftKey) {
      if (document.activeElement === state.firstFocusableEl) {
        keyboardEvent.preventDefault();
        state.lastFocusableEl.focus();
      }
    } else if (document.activeElement === state.lastFocusableEl) {
      keyboardEvent.preventDefault();
      state.firstFocusableEl.focus();
    }
  }
};

/**
 * Initialize FocusTrap module
 */
export const init = () => {
  stateHelper = createState(DEFAULT_MODULE_STATE);
};
