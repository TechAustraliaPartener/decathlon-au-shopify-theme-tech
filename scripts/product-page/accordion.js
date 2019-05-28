import '../utilities/element-closest-polyfill';
import { JS_PREFIX, IS_OPEN } from './constants';

/**
 * Module-specific constants
 */
const ACCORDION_SELECTOR = `.${JS_PREFIX}Accordion`;
const ACCORDION_HEADER_SELECTOR = `${ACCORDION_SELECTOR}-header`;
const CLICK_EVENT = 'click';

/**
 * Handler for when an accordion header button is clicked
 *
 * @this accordionHeaderButton The triggered button element
 */
const onButtonClick = function() {
  const accordion = this.closest(ACCORDION_SELECTOR);
  if (accordion) {
    const currentToggleState = accordion.classList.toggle(IS_OPEN);
    this.setAttribute('aria-expanded', String(currentToggleState));
  }
};

/**
 * Initializes functionality by setting up event binding
 */
export const init = () => {
  document
    .querySelectorAll(ACCORDION_HEADER_SELECTOR)
    .forEach(element => element.addEventListener(CLICK_EVENT, onButtonClick));
};
