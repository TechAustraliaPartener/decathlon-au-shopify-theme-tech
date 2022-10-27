import {
  PRODUCT_PAGE_COPY,
  INVENTORY_TYPE,
  OUT_OF_STOCK_HANDLING
} from '../constants';
import {
  isVariantOutOfStock,
  isVariantSoldOut,
  isVariantCC,
  isNonFollowedProduct,
  variantHasSufficientQuantity,
  variants
} from '../product-data';
import {
  isErrorScenario1,
  isErrorScenario2,
  isErrorScenario3
} from './error-scenarios';

export const DEFAULT_UI_STATE = {
  addToCartButtonText: PRODUCT_PAGE_COPY.ADD_TO_CART,
  validationText: '',
  isAddToCartButtonDisabled: false,
  isInAddToCartErrorState: false,
  shopifyErrorMessage: null
};

// Gets the first digit in the given `message`
export const getQuantityFromMessage = message =>
  message.split(/\s/g).find(word => /\d/g.test(word)) || '';

// Returns the ATC AJAX error state based on the Shopify error `description` value
export const getShopifyErrorUIState = shopifyErrorMessage => {
  const defaultShopifyErrorUIState = {
    ...DEFAULT_UI_STATE,
    shopifyErrorMessage,
    isInAddToCartErrorState: true
  };

  // Handle "Inventory Case 1: Entirely Sold Out"
  // https://app.gitbook.com/@decathlonusa/s/shopify/product-feature/product-page#inventory-cases
  if (isErrorScenario1(shopifyErrorMessage)) {
    if (isNonFollowedProduct()) {
      return {
        ...defaultShopifyErrorUIState,
        addToCartButtonText: PRODUCT_PAGE_COPY.SOLD_OUT,
        validationText: PRODUCT_PAGE_COPY.INVENTORY_RECENTLY_CHANGED,
        isAddToCartButtonDisabled: true
      };
    }

    return {
      ...defaultShopifyErrorUIState,
      addToCartButtonText:
        OUT_OF_STOCK_HANDLING === 'back_in_stock'
          ? PRODUCT_PAGE_COPY.EMAIL_ME_WHEN_IN_STOCK
          : PRODUCT_PAGE_COPY.OUT_OF_STOCK,
      validationText: PRODUCT_PAGE_COPY.OUT_OF_STOCK_RECENTLY_CHANGED
    };
  }

  // Handle "Inventory Case 2: Not sold out, can add at least 1 to cart"
  // https://app.gitbook.com/@decathlonusa/s/shopify/product-feature/product-page#inventory-cases
  if (isErrorScenario2(shopifyErrorMessage)) {
    return {
      ...defaultShopifyErrorUIState,
      validationText: PRODUCT_PAGE_COPY.allInStockProductsInYourCart(
        getQuantityFromMessage(shopifyErrorMessage)
      )
    };
  }

  //  Handle "Inventory Case 3: Not sold out, all stock already in cart"
  // https://app.gitbook.com/@decathlonusa/s/shopify/product-feature/product-page#inventory-cases
  if (isErrorScenario3(shopifyErrorMessage)) {
    return {
      ...defaultShopifyErrorUIState,
      validationText: PRODUCT_PAGE_COPY.ALL_AVAILABLE_PRODUCTS_IN_CART
    };
  }

  // Handle "Inventory Case 4: Unknown Shopify error message - "Catch All" case"
  // https://app.gitbook.com/@decathlonusa/s/shopify/product-feature/product-page#inventory-cases
  return {
    ...defaultShopifyErrorUIState,
    validationText: shopifyErrorMessage
  };
};

export const getUIState = variant => {
  if (!variant) {
    if (variants.every(isVariantOutOfStock)) {
      //alert(window.vars.productJSON.tags.includes('clearance'));
      return {
        ...DEFAULT_UI_STATE,
        addToCartButtonText:
          OUT_OF_STOCK_HANDLING === 'clearance'
            ? PRODUCT_PAGE_COPY.EMAIL_ME_WHEN_IN_STOCK
            : PRODUCT_PAGE_COPY.OUT_OF_STOCK,
        validationText: PRODUCT_PAGE_COPY.ALL_SIZES_OUT_OF_STOCK,
        isAddToCartButtonDisabled: OUT_OF_STOCK_HANDLING !== 'clearance',
        bisHidden: OUT_OF_STOCK_HANDLING === 'clearance' ? true : false
      };
    }
    return DEFAULT_UI_STATE;
  }

  if (isVariantSoldOut(variant)) {
    return {
      ...DEFAULT_UI_STATE,
      addToCartButtonText: PRODUCT_PAGE_COPY.SOLD_OUT,
      validationText: PRODUCT_PAGE_COPY.NEW_MODEL_IN_DESIGN,
      isAddToCartButtonDisabled: true,
      bisHidden: false
    };
  }

  if (isVariantOutOfStock(variant)) {
    return {
      ...DEFAULT_UI_STATE,
      addToCartButtonText:
        OUT_OF_STOCK_HANDLING !== 'back_in_stock'
          ? PRODUCT_PAGE_COPY.OUT_OF_STOCK
          : window.vars.productJSON.tags.includes('clearance') ? PRODUCT_PAGE_COPY.EMAIL_ME_WHEN_IN_STOCK : PRODUCT_PAGE_COPY.OUT_OF_STOCK,
      validationText: PRODUCT_PAGE_COPY.OUT_OF_STOCK,
      isAddToCartButtonDisabled: !window.vars.productJSON.tags.includes('clearance'),
      bisHidden: OUT_OF_STOCK_HANDLING === 'back_in_stock' ? true : false
    };
  }

  if (isVariantCC(variant)) {
    return {
      ...DEFAULT_UI_STATE,
      addToCartButtonText: 'Click & Collect',
      isAddToCartButtonDisabled: false,
      bisHidden: false
    };
  }

  if (INVENTORY_TYPE !== 'multi_location') {
    if (!variantHasSufficientQuantity(variant)) {
      return {
        ...DEFAULT_UI_STATE,
        validationText: PRODUCT_PAGE_COPY.limitedQuantityLeft(
          variant.inventory_quantity
        )
      };
    }
  }

  return DEFAULT_UI_STATE;
};
