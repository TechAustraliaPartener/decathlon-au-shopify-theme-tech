import '../utilities/element-closest-polyfill';
import { JS_PREFIX } from './constants';

/**
 * Module-specific constants
 */
const ACCORDION_SELECTOR = `.${JS_PREFIX}Accordion`;
const ACCORDION_HEADER_SELECTOR = `${ACCORDION_SELECTOR}-header`;
const CLICK_EVENT = 'click';
const IS_OPEN = 'is-open';

/**
 * Handler for when an accordion header button is clicked
 *
 * @this accordionHeaderButton The triggered button element
 */
const onButtonClick = function() {
  const accordion = this.closest(ACCORDION_SELECTOR);
  accordion && accordion.classList.toggle(IS_OPEN);
};

/**
 * Initializes functionality by setting up event binding
 */
export const init = () => {
  document
    .querySelectorAll(ACCORDION_HEADER_SELECTOR)
    .forEach(element => element.addEventListener(CLICK_EVENT, onButtonClick));
};
