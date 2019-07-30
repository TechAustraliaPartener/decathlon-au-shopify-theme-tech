// @ts-check

import { PRODUCT_PAGE_COPY } from '../constants';
import {
  isVariantOutOfStock,
  isVariantSoldOut,
  isEndOfLifeProduct,
  variantHasSufficientQuantity,
  variants
} from '../product-data';
import {
  isErrorScenario1,
  isErrorScenario2,
  isErrorScenario3
} from './error-scenarios';

/**
 * Type for the ATC UI state
 *
 * @typedef {Object} UIState
 *
 * @property {string} addToCartButtonText
 * @property {string} validationText
 * @property {boolean} isAddToCartButtonDisabled
 * @property {boolean} isInAddToCartErrorState
 * @property {string | null} shopifyErrorMessage
 */

/** @type {UIState} */
export const DEFAULT_UI_STATE = {
  addToCartButtonText: PRODUCT_PAGE_COPY.ADD_TO_CART,
  validationText: '',
  isAddToCartButtonDisabled: false,
  isInAddToCartErrorState: false,
  shopifyErrorMessage: null
};

/**
 * Gets the first digit in the given `message`
 * @param {string} message A Shopify error `description` value
 * @returns {string}
 */
export const getQuantityFromMessage = message =>
  message.split(/\s/g).find(word => /\d/g.test(word)) || '';

/**
 * Returns the ATC AJAX error state based on the Shopify error `description` value
 *
 * @param {string} shopifyErrorMessage A Shopify error `description` value
 * @returns {UIState}
 */
export const getShopifyErrorUIState = shopifyErrorMessage => {
  const defaultShopifyErrorUIState = {
    ...DEFAULT_UI_STATE,
    shopifyErrorMessage,
    isInAddToCartErrorState: true
  };

  /**
   * Handle "Inventory Case 1: Entirely Sold Out"
   * @see https://app.gitbook.com/@decathlonusa/s/shopify/product-feature/product-page#inventory-cases
   */
  if (isErrorScenario1(shopifyErrorMessage)) {
    if (isEndOfLifeProduct()) {
      return {
        ...defaultShopifyErrorUIState,
        addToCartButtonText: PRODUCT_PAGE_COPY.SOLD_OUT,
        validationText: PRODUCT_PAGE_COPY.INVENTORY_RECENTLY_CHANGED,
        isAddToCartButtonDisabled: true
      };
    }

    return {
      ...defaultShopifyErrorUIState,
      addToCartButtonText: PRODUCT_PAGE_COPY.EMAIL_ME_WHEN_IN_STOCK,
      validationText: PRODUCT_PAGE_COPY.OUT_OF_STOCK_RECENTLY_CHANGED
    };
  }

  /**
   * Handle "Inventory Case 2: Not sold out, can add at least 1 to cart"
   * @see https://app.gitbook.com/@decathlonusa/s/shopify/product-feature/product-page#inventory-cases
   */
  if (isErrorScenario2(shopifyErrorMessage)) {
    return {
      ...defaultShopifyErrorUIState,
      validationText: PRODUCT_PAGE_COPY.allInStockProductsInYourCart(
        getQuantityFromMessage(shopifyErrorMessage)
      )
    };
  }

  /**
   * Handle "Inventory Case 3: Not sold out, all stock already in cart"
   * @see https://app.gitbook.com/@decathlonusa/s/shopify/product-feature/product-page#inventory-cases
   */
  if (isErrorScenario3(shopifyErrorMessage)) {
    return {
      ...defaultShopifyErrorUIState,
      validationText: PRODUCT_PAGE_COPY.ALL_AVAILABLE_PRODUCTS_IN_CART
    };
  }

  /**
   * Handle "Inventory Case 4: Unknown Shopify error message - "Catch All" case"
   * @see https://app.gitbook.com/@decathlonusa/s/shopify/product-feature/product-page#inventory-cases
   */
  return {
    ...defaultShopifyErrorUIState,
    validationText: shopifyErrorMessage
  };
};

/**
 * Returns the appropriate UI state depending on the `variant`
 *
 * @param {Variant | undefined} variant
 * @returns {UIState}
 */
export const getUIState = variant => {
  if (!variant) {
    if (variants.every(isVariantOutOfStock)) {
      return {
        ...DEFAULT_UI_STATE,
        addToCartButtonText: PRODUCT_PAGE_COPY.EMAIL_ME_WHEN_IN_STOCK,
        validationText: PRODUCT_PAGE_COPY.ALL_SIZES_OUT_OF_STOCK
      };
    }
    return DEFAULT_UI_STATE;
  }

  if (isVariantSoldOut(variant)) {
    return {
      ...DEFAULT_UI_STATE,
      addToCartButtonText: PRODUCT_PAGE_COPY.SOLD_OUT,
      validationText: PRODUCT_PAGE_COPY.NEW_MODEL_IN_DESIGN,
      isAddToCartButtonDisabled: true
    };
  }

  if (isVariantOutOfStock(variant)) {
    return {
      ...DEFAULT_UI_STATE,
      addToCartButtonText: PRODUCT_PAGE_COPY.EMAIL_ME_WHEN_IN_STOCK,
      validationText: PRODUCT_PAGE_COPY.OUT_OF_STOCK
    };
  }

  if (!variantHasSufficientQuantity(variant)) {
    return {
      ...DEFAULT_UI_STATE,
      validationText: PRODUCT_PAGE_COPY.limitedQuantityLeft(
        variant.inventory_quantity
      )
    };
  }

  return DEFAULT_UI_STATE;
};
