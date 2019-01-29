/**
 * "Hidden" CSS class from the Patterns Toolkit CSS.
 */
const CSS_HIDDEN_CLASS = 'de-u-hidden';

/**
 * Hides HTML element by adding CSS class
 * @param {Element} element The HTML element to hide
 */
const hideElement = element => {
  element.classList.add(CSS_HIDDEN_CLASS);
};

/**
 * Shows HTML element by removing CSS class
 * @param {Element} element The HTML element to hide
 */
const showElement = element => {
  element.classList.remove(CSS_HIDDEN_CLASS);
};

/**
 * Helper function shortening call to querySelector
 * @param {string} selector Element CSS selector
 * @returns {Element} Element that matches the specified selector
 */
export const querySelector = selector => document.querySelector(selector);

/**
 * Hides all HTML elements in array
 * @param {array} elements An array of HTML elements
 */
export const hideElements = elements => {
  elements.forEach(hideElement);
};

/**
 * Shows all HTML elements in array
 * @param {array} elements An array of HTML elements
 */
export const showElements = elements => {
  elements.forEach(showElement);
};
