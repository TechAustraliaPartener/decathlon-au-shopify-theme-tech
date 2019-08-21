// @ts-check

import { IS_HIDDEN_CLASS } from '../shared/constants';

/**
 * Hide an element with utility class (display: none)
 * @param {HTMLElement | null | undefined} el
 */
export const hideElement = el => {
  if (el) el.classList.add(IS_HIDDEN_CLASS);
};

/**
 * Remove hiding utility class from an element
 * @param {HTMLElement | null | undefined} el
 */
export const showElement = el => {
  if (el) el.classList.remove(IS_HIDDEN_CLASS);
};

/**
 * Checks if HTML element exists in the DOM
 * @param {HTMLElement} element The HTML element to check
 * @returns {Boolean}
 * @todo Delete. Adds unnecessary abstraction/cognitive load.
 */
export const elementExists = element => {
  return Boolean(element);
};

/**
 * Hides all HTML elements in array
 * @param {NodeListOf<HTMLElement> | HTMLElement[]} elements An array of HTML elements
 */
export const hideElements = elements => {
  elements.forEach(hideElement);
};

/**
 * Shows all HTML elements in array
 * @param {NodeListOf<HTMLElement> | HTMLElement[]} elements An array of HTML elements
 */
export const showElements = elements => {
  elements.forEach(showElement);
};

/**
 * Disables HTML input element
 * @param {HTMLInputElement} input An HTML input element
 */
export const disableInput = input => {
  if (!input) return;
  input.disabled = true;
};

/**
 * Enables HTML input element
 * @param {HTMLInputElement} input An HTML input element
 */
export const enableInput = input => {
  if (!input) return;
  input.disabled = false;
};
