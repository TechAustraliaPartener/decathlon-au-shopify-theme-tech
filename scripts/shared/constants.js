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

/**
 * GENERAL
 */

/**
 * Name for storing a Storefront API health check boolean
 */
export const STOREFRONT_API_IS_TESTED = `${CSS_PREFIX}storefront-api-is-tested`;

/**
 * A timeout in minutes for caching a Storefront API health check
 */
export const STOREFRONT_API_TEST_TIMEOUT_MINUTES =
  parseInt(process.env.STOREFRONT_API_TEST_TIMEOUT_MINUTES, 10) || 15;
