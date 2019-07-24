// @ts-check

import { IS_HIDDEN_CLASS } from '../shared/constants';

/**
 * Hide an element with utility class (display: none)
 * @param {Element | null | undefined} el
 */
export const hide = el => {
  if (el) el.classList.add(IS_HIDDEN_CLASS);
};

/**
 * Remove hiding utility class from an element
 * @param {Element | null | undefined} el
 */
export const show = el => {
  if (el) el.classList.remove(IS_HIDDEN_CLASS);
};
