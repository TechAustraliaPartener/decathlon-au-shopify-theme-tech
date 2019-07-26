// @ts-check
import { JS_PREFIX } from './constants';

/**
 * Root element(s)
 */

/** @type {HTMLButtonElement} */
const addToCartButtonEl = document.querySelector(`.${JS_PREFIX}AddToCart-btn`);

/**
 * Module constants
 */
const CLICK_EVENT = 'click';
const KEY_DOWN_EVENT = 'keydown';
const ESCAPE_KEY_VALUE = 'escape';

/**
 * Has the document binding been initialized
 */
let isListenerInitialized = false;

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
const keyboardEventHandler = ({ key }) => {
  /**
   * For better accessibility, the modal should close via the "escape" key
   */
  if (isEscapeKey(key) && window.BISPopover) {
    window.BISPopover.hide();
  }
};

/** @type {HTMLElement | undefined} */
let lastFocusedElement;

/**
 * Handle ATC click event
 */
const onAddToCartClick = () => {
  // Store the element that was focused before the modal was opened. It will be focused after the modal is closed
  lastFocusedElement = /** @type {HTMLElement} */ (document.activeElement);
  if (!isListenerInitialized) {
    // Add keydown listener to document
    bindDocumentKeyDown();
    const originalHideFunction = window.BISPopover.form.hide;
    // Intercept hide to re-focus where the user focus was before opening the modal
    window.BISPopover.form.hide = () => {
      originalHideFunction();
      lastFocusedElement.focus();
    };
    isListenerInitialized = true;
  }
};

/**
 * Add event listener to document
 */
const bindDocumentKeyDown = () => {
  /** @type {HTMLIFrameElement} */
  const BISPopeverEl = document.querySelector('#BIS_frame');
  if (BISPopeverEl) {
    BISPopeverEl.contentDocument.addEventListener(
      KEY_DOWN_EVENT,
      keyboardEventHandler
    );
  }
};

/**
 * Initialize BISPopover accessibility enhancement(s)
 */
export const init = () => {
  /**
   * Listener for Add to Cart button
   */
  if (addToCartButtonEl) {
    addToCartButtonEl.addEventListener(CLICK_EVENT, onAddToCartClick);
  }
};
