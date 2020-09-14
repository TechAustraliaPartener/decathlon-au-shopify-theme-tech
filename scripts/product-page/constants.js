// @ts-check

/**
 * Import shared prefixes
 */
import { CSS_PREFIX, CSS_UTILITY_PREFIX, JS_PREFIX } from '../shared/constants';

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
 * Global inventory type
 */
export const INVENTORY_TYPE = window.vars.inventoryType;
export const OUT_OF_STOCK_HANDLING = window.vars.outOfStockHandling;

/**
 * TAGS
 */

/**
 * The product tag that indicates that the product will not be restocked
 * @see https://app.gitbook.com/@decathlonusa/s/shopify/implemented-features-documentation/product-page-v1#sold-out-logic
 */
export const NON_FOLLOWED_TAG = 'NonFollowed';

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
 * TEXT CONSTANTS
 */

/**
 * Text used to update UI elements
 * @todo Use translation keys
 */

export const PRODUCT_PAGE_COPY = {
  SELECT_A_SIZE: 'Select a size',
  ADD_TO_CART: 'Add to Cart',
  SOLD_OUT: 'Sold Out',
  EMAIL_ME_WHEN_IN_STOCK: 'Email Me When In Stock',
  OUT_OF_STOCK: 'Out of stock',
  ALL_SIZES_OUT_OF_STOCK:
    'Out of stock.',
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
   * Provides the proper UI text to display
   * • If quantity 0 left => "0 left"
   * • If quantity > 0 => "Only X left"
   * @todo Consider moving out of constants because different values can be returned
   * @param {string | number} quantity
   * @returns {string}
   */
  limitedQuantityLeft: quantity =>
    quantity === 0 ? `${quantity} left` : `Only ${quantity} left`
};

/*
 * CSS class that sets content to a fixed (no scroll) state
 */
export const FIXED_CLASS = `${CSS_PREFIX}content-is-fixed`;

/*
 * CSS class that indicates an element should hide vertical overflow
 */
export const HIDE_OVERFLOW_Y_CLASS = `${CSS_UTILITY_PREFIX}overflowYNone`;

/**
 * CSS class used by components that need an "open" state
 */
export const IS_OPEN = `${CSS_PREFIX}is-open`;

/**
 * Re-export shared constants
 */
export * from '../shared/constants';
