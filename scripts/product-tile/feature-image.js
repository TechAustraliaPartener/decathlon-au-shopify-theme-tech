// @ts-check

import { JS_PREFIX } from './constants';
import { createState } from '../utilities/create-state';

/**
 * @typedef {Object} Image
 * @property {string} [url]
 * @property {string} [alt]
 */

/**
 * @typedef {Object} FeatureImageState
 * @property {Image} image1
 * @property {Image} image2
 * @property {boolean} isHovered
 */

/**
 * @param {HTMLElement} productTileEl
 */
export const init = productTileEl => {
  /** @type {HTMLImageElement} */
  const imageEl = productTileEl.querySelector(
    `.${JS_PREFIX}ProductTile-featureImage`
  );

  /** @type {FeatureImageState} */
  const initialState = { image1: {}, image2: {}, isHovered: false };

  const state = createState(initialState);

  state.onChange(({ image1, image2, isHovered }) => {
    const { url, alt } = isHovered ? image2 : image1;
    imageEl.src = url;
    imageEl.alt = alt;
  });

  imageEl.addEventListener('mouseenter', () =>
    state.updateState({ isHovered: true })
  );

  imageEl.addEventListener('mouseleave', () =>
    state.updateState({ isHovered: false })
  );

  return {
    /**
     * Updates the feature image to the selected color
     * @param {{ image1: Image, image2: Image }} newImages
     */
    updateImages: newImages => state.updateState(newImages)
  };
};
