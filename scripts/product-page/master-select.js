// @ts-check

/**
 * MasterSelect module
 *
 * Manipulates the master "Shopify" Timber theme <select> element.
 */

import { getSelectedVariant } from './product-data';
// @todo Consider removing jQuery dependency
import $ from 'jquery';

/**
 * Attach JS to the Shopify Timber theme <select> element
 * @todo Consider removing jQuery dependency
 */
export const $MasterSelect = $('#productSelect');

/**
 * We want to keep the master `<select>` input  and the URL up-do-date with the
 * selection size/color combination.
 *
 * @param {object} obj A data object
 * @param {string} obj.size Value of the selected size option
 * @param {string} obj.color Value of the selected color option
 */
export const updateUI = ({ size, color }) => {
  // We need the full variant based on selected size & color
  const selectedVariant = getSelectedVariant({ size, color });
  // We can then update the master `<select>` input with the variant ID
  if (selectedVariant) {
    // @todo Consider removing jQuery dependency
    $MasterSelect.val(selectedVariant.id);
  }
};
