// @ts-check

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
 * @see https://app.gitbook.com/@decathlonusa/s/shopify/product-feature/product-page#sold-out-logic
 */
export const END_OF_LIFE_TAG = 'EndOfLife';

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
/**
 * @todo Move module-only constants to specific module
 */
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
  ADD_TO_CART: 'Add to Cart',
  SOLD_OUT: 'Sold Out',
  EMAIL_ME_WHEN_IN_STOCK: 'Email Me When In Stock',
  OUT_OF_STOCK: 'Out of Stock',
  NEW_MODEL_IN_DESIGN: 'New model in design',
  OUT_OF_STOCK_RECENTLY_CHANGED: 'Out of stock. Inventory recently changed.',
  INVENTORY_RECENTLY_CHANGED: 'Inventory recently changed',
  ALL_AVAILABLE_PRODUCTS_IN_CART: 'All available products are in your cart.',
  /**
   * @param {string | number} quantity
   * @returns {string}
   */
  allInStockProductsInYourCart: quantity =>
    `All in stock products are now in your cart. ${quantity} ${
      Number(quantity) === 1 ? 'was' : 'were'
    } added.`,
  /**
   * @param {string | number} quantity
   * @returns {string}
   */
  limitedQuantityLeft: quantity => `Only ${quantity} left`
};

/*
 * CSS class that sets content to a fixed (no scroll) state
 */
export const FIXED_CLASS = `${CSS_PREFIX}content-is-fixed`;

/*
 * CSS class that indicates an element should hide vertical overflow
 */
export const HIDE_OVERFLOW_Y_CLASS = `${CSS_UTILITY_PREFIX}overflowYHidden`;

/**
 * CSS class used by components that need an "open" state
 */
export const IS_OPEN = `${CSS_PREFIX}is-open`;
