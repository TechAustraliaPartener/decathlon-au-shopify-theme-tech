// @ts-check

/**
 * ENVIRONMENT
 */

export const PROD_HOSTNAME = 'www.decathlon.com';

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
 * The CSS utility class for visibly hiding elements
 */
export const IS_HIDDEN_CLASS = `${CSS_UTILITY_PREFIX}hidden`;
