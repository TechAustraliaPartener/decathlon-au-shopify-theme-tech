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
 * The CSS classes used to update the UI on variant changes
 */
export const IS_ACTIVE_CLASS = `${CSS_PREFIX}is-active`;
export const IS_TRANSITIONING_CLASS = `${CSS_PREFIX}is-transitioning`;
export const IS_OUT_OF_STOCK_CLASS = `${CSS_PREFIX}is-outofstock`;
export const IS_SOLD_OUT_CLASS = `${CSS_PREFIX}is-soldout`;
export const VALIDATION_MESSAGE_CLASS = `${JS_PREFIX}validation-message`;
export const ADD_TO_CART_CLASS = `${JS_PREFIX}AddtoCart`;
export const PRICE_CLASS = `${JS_PREFIX}ProductPrice`;
export const COMPARE_PRICE_CLASS = `${JS_PREFIX}ComparePrice-text`;
/**
 * The CSS utility class for visibly hiding elements
 */
export const IS_HIDDEN_CLASS = `${CSS_UTILITY_PREFIX}hidden`;

/**
 * TEXT CONSTANTS
 */

/**
 * Text used to update UI elements
 */

export const PRODUCT_PAGE_COPY = {
  ATC_AVAILABLE: 'Add to Cart',
  ATC_SOLD_OUT: 'Sold Out',
  ATC_OUT_OF_STOCK: 'Get Notified When Available',
  VALIDATION_SOLD_OUT: 'Sold Out',
  VALIDATION_OUT_OF_STOCK: 'Out of Stock'
};

/*
 * CSS class that sets content to a fixed (no scroll) state
 */
export const FIXED_CLASS = `${CSS_PREFIX}content-is-fixed`;
