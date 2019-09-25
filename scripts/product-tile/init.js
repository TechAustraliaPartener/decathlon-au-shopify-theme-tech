// @ts-check

import { DEBUG } from '../shared/config';
import { JS_PREFIX } from './constants';
import { createState } from '../utilities/create-state';
import * as colorSwatches from './color-swatches';
import * as price from './price';
import * as featureImage from './feature-image';
import * as freeShipping from './free-shipping';

/**
 * Module-specific type definitions
 */

/**
 * @typedef {Object} ProductTileState
 *
 * Defines the state properties for Product Tile
 *
 * The `prices` value comes from the `data-prices` attribute. The `data-prices`
 * attribute value is attached to each color swatch. The price values represent
 * the prices available for a given color. Example: `data-prices="1000|2000|1500"`
 *
 * The `priceVaries` value will be false (from Shopify) when there is
 * no price range. This means the `data-prices` attribute on a color swatch
 * element might be something like `"1000|1000|1000"` when `priceVaries`
 * is `false`.
 *
 * @property {HTMLElement} [productTileEl]
 * @property {string} [chosenColor]
 */

/**
 * Module-specific constants
 */
const PRODUCT_TILE_CSS_SELECTOR = `.${JS_PREFIX}ProductTile`;

/**
 * @typedef {Object} SwatchOptions
 * Options that come from data attributes on the swatch elements

 * @property {string} [productId] From the `data-product-id` attribute
 * @property {string} [image1] Sourced from `data-image` attribute, the main image for the selected color
 * @property {string} [image1Alt] Sourced from `data-image-alt` attribute, the alt text for the main image for the selected color
 * @property {string} [image2] Sourced from `data-image2` attribute, the 2nd image for the selected color
 * @property {string} [image2Alt] Sourced from `data-image2-alt` attribute, the alt text for the 2nd image for the selected color
 * @property {string} [prices] Sourced from `data-prices` attribute, the variant-level price values
 * @property {string} [pricesDelimiter] Sourced from `data-prices-delimiter` attribute, prices list delimiter
 * @property {boolean} [priceVaries] Sourced from Shopify `product.priceVaries`, product-level value
 * @property {string} [compareAtPrice] Sourced from Shopify `product.compare_at_price` value
 * @property {boolean} [compareAtPriceVaries] Sourced from Shopify `product.compare_at_price_varies` value
 * @property {boolean} [isFreeShipping] Sourced from `data-is-free-shipping` attribute, whether a product qualifies for the "Free shipping" (price >= $50)
 */

/**
 * Helper to get the first color swatch color
 *
 * @param {HTMLElement} productTileEl
 * @returns {string|null} A SwatchOptions color key
 */
const getFirstSwatchColorForTile = productTileEl => {
  /** @type HTMLElement|null */
  const firstColorSwatchEl = productTileEl.querySelector(
    colorSwatches.COLOR_SWATCH_SELECTOR
  );
  return firstColorSwatchEl && firstColorSwatchEl.dataset.color;
};

/**
 * Scoped Product Tile
 *
 * This allows each Product Tile to have its own scoped state.
 *
 * @param {HTMLElement} productTileEl
 */
export const initProductTile = productTileEl => {
  /**
   * @type {ProductTileState}
   */
  const productTileState = {
    productTileEl
  };

  const allSwatches = /** @type {HTMLElement[]} */ ([
    ...productTileEl.querySelectorAll(colorSwatches.COLOR_SWATCH_SELECTOR)
  ]);

  /** Map of all the colors to all the options associated with those colors (retrieved from data attributes) */
  const allSwatchOptions = allSwatches.reduce(
    (allSwatchOptions, el) => {
      const dataset = el.dataset;
      return {
        ...allSwatchOptions,
        [dataset.color]: {
          productId: dataset.productId,
          prices: dataset.prices,
          delimiter: dataset.pricesDelimiter,
          image1: dataset.image,
          image1Alt: dataset.imageAlt,
          image2: dataset.image2,
          image2Alt: dataset.image2Alt,
          compareAtPrice: dataset.compareAtPrice,
          priceVaries: dataset.priceVaries === 'true',
          compareAtPriceVaries: dataset.compareAtPriceVaries === 'true',
          isFreeShipping: dataset.isFreeShipping === 'true'
        }
      };
    },
    /** @type {{[color: string]: SwatchOptions}} */ ({})
  );

  const state = createState(productTileState);

  /**
   * @param {SwatchOptions | undefined} [swatchOptions]
   */
  const getImagesFromSwatchOptions = (
    swatchOptions = allSwatchOptions[allSwatches[0].dataset.color]
  ) => ({
    image1: {
      url: swatchOptions.image1,
      alt: swatchOptions.image1Alt
    },
    image2: {
      url: swatchOptions.image2,
      alt: swatchOptions.image2Alt
    }
  });

  // Initialize the child UI components first
  colorSwatches.init(productTileEl);
  const featureImageInstance = featureImage.init(productTileEl);
  const freeShippingInstance = freeShipping.init(productTileEl);
  // Pass the initial images to the feature image component
  // in case the image gets hovered before a swatch gets selected
  featureImageInstance.updateImages(getImagesFromSwatchOptions());

  if (DEBUG) {
    state.onChange(newState =>
      console.debug('ProductTile::newState:', newState)
    );
  }

  state.onChange(
    ({ chosenColor }) => {
      const matchingSwatchOptions = allSwatchOptions[chosenColor];
      // Here, we can update any other UI elements via their appropriate modules
      price.render({ ...matchingSwatchOptions, productTileEl });
      featureImageInstance.updateImages(
        getImagesFromSwatchOptions(matchingSwatchOptions)
      );
      freeShippingInstance.updateFreeShipping(matchingSwatchOptions);
    },
    state => [state.chosenColor]
  );

  // Then setup the callback to be called when a color is selected
  colorSwatches.onColorSelect(chosenColor =>
    state.updateState({ chosenColor })
  );

  // Reset Product Tile state when hovering off of Product Tile
  productTileEl.addEventListener('mouseleave', () => {
    const chosenColor = getFirstSwatchColorForTile(productTileEl);

    if (chosenColor) {
      state.updateState({
        chosenColor
      });
    }
  });
};

/**
 * Initializes all child UI modules
 */
export const initProductTiles = () => {
  document.querySelectorAll(PRODUCT_TILE_CSS_SELECTOR).forEach(initProductTile);
};
