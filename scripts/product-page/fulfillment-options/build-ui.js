// @ts-check

import { TOMORROW } from './constants';
import { getThumbnailImageSrc } from '../../utilities/get-thumbnail-image-src';

/**
 * Build a list of stores for pickup, to be displayed in the fulfillment
 * options drawer (or anywhere)
 * NOTE: The constant `TOMORROW` should eventually be replaced by a value
 * retrieved from a function containing logic about warehouse and/or
 * store stock, and distance from warehouse to store.
 *
 * @param {Array} stores A collection of stores
 * @returns {String} A collection of store tile components
 */
export const buildStoreTile = stores =>
  stores
    .map(store => {
      return `
          <li class="StorePickup-tile de-u-flex de-u-flexJustifyBetween">
            <div>
              <h6
                class="de-u-spaceBottomNone
                      de-u-textSemibold de-u-textGrow1 de-u-lineHeight2">
                Free pickup <span>${TOMORROW}</span>
              </h6>
              <p class="de-u-spaceBottomNone de-u-lineHeight3 de-u-textShrink1">
                <span class="de-u-textSemibold de-u-textBlack de-u-lineHeight3">
                  ${store.city}
                </span> ${store.street1}
              </p>
              ${
                store.street2
                  ? `<p class="de-u-textShrink1 de-u-spaceBottomNone">
                  ${store.street2}
                </p>`
                  : ''
              }
            </div>
            <div class="de-u-flex de-u-flexAlignItemsCenter de-u-padRight06">
              ${store.distance}
            </div>
          </li>
        `;
    })
    .join('');

/**
 * Updates the selected product variant details in the fulfillment options drawer
 * @param {Object} params
 * @param {Object} params.selectedVariant - The details of the selected product variant
 * @param {HTMLElement} params.variantColorEl - The product variant color element
 * @param {HTMLElement} params.variantSizeEl - The product variant size element
 * @param {HTMLElement} params.thumbnailImageEl - The image element that displays
 * the thumbnnail in the drawer
 */
export const updateProductInDrawer = ({
  selectedVariant,
  variantColorEl,
  variantSizeEl,
  thumbnailImageEl
}) => {
  if (selectedVariant.option1)
    variantSizeEl.innerText = selectedVariant.option1;
  if (selectedVariant.option2)
    variantColorEl.innerText = selectedVariant.option2;
  if (selectedVariant.featured_image && selectedVariant.featured_image.src)
    thumbnailImageEl.setAttribute(
      'src',
      getThumbnailImageSrc(selectedVariant.featured_image.src)
    );
};

/**
 * Sets a story city and address for display in fulfillment options on the
 * page (in buybox)
 * @param {Object} params
 * @param {Object} params.store - The data for the store closest to a user
 * (determined prior to passing in here)
 * @param {HTMLElement} params.storeCityEl - The element for showing a store's city
 * @param {HTMLElement} params.storeAddress1El - The element for showing a store's
 * primary address
 */
export const setClosestStoreInfo = ({
  store,
  storeCityEl,
  storeAddress1El
}) => {
  storeCityEl.innerHTML = store.city;
  storeAddress1El.innerHTML = store.street1;
};
