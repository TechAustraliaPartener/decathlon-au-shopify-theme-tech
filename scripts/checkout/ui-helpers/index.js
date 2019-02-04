/**
 * Pattern Toolkit CSS classes to manipulate DOM
 */
const HIDDEN = 'de-u-hidden';

/**
 * Hides HTML element by adding CSS class
 * @param {Element} element The HTML element to hide
 */
const hideElement = element => {
  if (!element) return;
  element.classList.add(HIDDEN);
};

/**
 * Shows HTML element by removing CSS class
 * @param {Element} element The HTML element to hide
 */
const showElement = element => {
  if (!element) return;
  element.classList.remove(HIDDEN);
};

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

/**
 * Disables HTML input element
 * @param {Element} input An HTML input element
 */
export const disableInput = input => {
  if (!input) return;
  input.disabled = true;
};

/**
 * Enables HTML input element
 * @param {Element} input An HTML input element
 */
export const enableInput = input => {
  if (!input) return;
  input.disabled = false;
};
