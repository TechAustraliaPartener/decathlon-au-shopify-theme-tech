// @ts-check

/**
 * MasterSelect module
 *
 * Manipulates the master "Shopify" Timber theme <select> element.
 */

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
 * @param {Variant} variant
 */
export const onVariantSelect = variant => {
  // We can then update the master `<select>` input with the variant ID
  // @todo Consider removing jQuery dependency
  $MasterSelect.val(variant.id);
};
