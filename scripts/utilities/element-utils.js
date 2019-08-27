// @ts-check

import { IS_HIDDEN_CLASS } from '../shared/constants';

/**
 * Hide an element with utility class (display: none)
 * @param {Element | null | undefined} el
 */
export const hideElement = el => {
  if (el) el.classList.add(IS_HIDDEN_CLASS);
};

/**
 * Remove hiding utility class from an element
 * @param {Element | null | undefined} el
 */
export const showElement = el => {
  if (el) el.classList.remove(IS_HIDDEN_CLASS);
};

/**
 * Checks if an element exists in the DOM
 * @param {Element} element The HTML element to check
 * @returns {Boolean}
 * @todo Delete. Adds unnecessary abstraction/cognitive load.
 */
export const elementExists = element => {
  return Boolean(element);
};

/**
 * Hides all elements in array
 * @param {NodeListOf<Element> | Element[]} elements An array of HTML elements
 */
export const hideElements = elements => {
  elements.forEach(hideElement);
};

/**
 * Shows all elements in array
 * @param {NodeListOf<Element> | Element[]} elements An array of HTML elements
 */
export const showElements = elements => {
  elements.forEach(showElement);
};

/**
 * Disables input element
 * @param {HTMLInputElement} input An HTML input element
 */
export const disableInput = input => {
  if (!input) return;
  input.disabled = true;
};

/**
 * Enables input element
 * @param {HTMLInputElement} input An HTML input element
 */
export const enableInput = input => {
  if (!input) return;
  input.disabled = false;
};
