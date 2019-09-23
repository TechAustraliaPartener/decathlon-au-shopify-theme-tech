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
 * A flag to indicate that a checkout webURL was created
 * using the Storefront API
 */
export const IS_CUSTOM_CHECKOUT = `${CSS_PREFIX}is-custom-checkout`;

/**
 * Name for storing a Storefront API health check boolean
 */
export const STOREFRONT_API_IS_TESTED = `${CSS_PREFIX}storefront-api-is-tested`;

/**
 * A timeout in minutes for caching a Storefront API health check
 */
export const STOREFRONT_API_TEST_TIMEOUT_MINUTES =
  parseInt(process.env.STOREFRONT_API_TEST_TIMEOUT_MINUTES, 10) || 15;

/**
 * Flag to indicate that a checkout was created by the online store, and not
 * the Shopify Storefront API
 */

export const IS_ONLINE_STORE_CHECKOUT = `is-online-store-checkout`;

/**
 * Flag to indicate that checkout has been attempted. To be unset within
 * checkout or detectable on Cart page if checkout transition fails
 */
export const IS_CHECKING_OUT = 'is-checking-out';
