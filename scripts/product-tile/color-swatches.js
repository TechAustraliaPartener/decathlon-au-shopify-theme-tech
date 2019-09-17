// @ts-check

/**
 * Color Swatches
 *
 * This module handles DOM interactions for the Product Tile color swatches.
 */

import { JS_PREFIX } from './constants';

/**
 * Will reference the parent Product Tile root element
 */
let productTileEl = null;

export const COLOR_SWATCH_SELECTOR = `.${JS_PREFIX}ColorSwatchList-action`;

/**
 * Sets up listeners on all color swatch elements
 * @param {(color: string) => void} onColorSelectCallback Called with the selected color when a color is hovered
 */
export const onColorSelect = onColorSelectCallback => {
  productTileEl
    .querySelectorAll(COLOR_SWATCH_SELECTOR)
    .forEach(colorSwatchEl => {
      colorSwatchEl.addEventListener('mouseenter', event => {
        // Call the callback with the new color swatch data
        onColorSelectCallback(
          /** @type {HTMLElement} */ (event.target).dataset.color
        );
      });
    });
};

/**
 * Initialize setup
 *
 * @param {HTMLElement} el
 */
export const init = el => {
  productTileEl = el;
};
