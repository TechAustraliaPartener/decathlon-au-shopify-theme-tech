/**
 * PREFIXES
 */

/**
 * All styling CSS classes should have the CSS_PREFIX
 */
export const CSS_PREFIX = 'de-';

/**
 * All utility classes should have the CSS_UTILITY_PREFIX
 */
export const CSS_UTILITY_PREFIX = `${CSS_PREFIX}u-`;

/**
 * All JS-bound CSS classes should have the JS_PREFIX
 */
export const JS_PREFIX = `js-${CSS_PREFIX}`;

/**
 * Icon prefix
 */
export const ICON_PREFIX = `${CSS_PREFIX}Icon-`;

/**
 * SUFFIXES
 */

/**
 * Container (e.g., for Handlebars)
 */
export const CONTAINER_SUFFIX = '-container';

/**
 * Template (e.g., for Handlebars)
 */
export const TEMPLATE_SUFFIX = '-template';

/**
 * TAGS
 */

/**
 * The product tag that indicates that the product will not be restocked
 */
export const IS_SOLD_OUT_TAG = 'EndOfLife';

/**
 * CSS Classes
 */

/**
 * The CSS classes used to update the UI to an "active" or "unavailable" state
 */
export const IS_ACTIVE_CLASS = `${CSS_PREFIX}is-active`;
export const IS_OUT_OF_STOCK_CLASS = `${CSS_PREFIX}is-outofstock`;
export const IS_SOLD_OUT_CLASS = `${CSS_PREFIX}is-soldout`;
/**
 * The CSS utility class for visibly hiding elements
 */
export const IS_HIDDEN_CLASS = `${CSS_UTILITY_PREFIX}hidden`;
