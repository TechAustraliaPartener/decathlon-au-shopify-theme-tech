// @ts-check

import { encode, decode } from 'qss';

/**
 * Query string module
 *
 * Provides helpers for interacting with URL paramaters
 */

/**
 * Parses variant id out of the URL
 */
export const getUrlVariant = () => {
  
  const urlParams = new URLSearchParams(window.location.search);
  /** @type {{variant?: string}} */
  return urlParams.get('variant');
};

/**
 * Gets the source of the link to product page 
 */
export const getProductLinkSource = () => {
  const urlParams = new URLSearchParams(window.location.search);
  /** @type {{source?: string}} */
  return urlParams.get('source');
}

/**
 * Updates the variant id in the URL when a new variant is selected
 *
 * @param {string | number | null | undefined} variantId The variant ID
 */
export const updateUrlVariant = variantId => {
  /** @type any */
  const parsedQueryParams = decode(
    // Remove "?"
    window.location.search.substr(1)
  );
  parsedQueryParams.variant = variantId === null ? undefined : variantId;
  const updatedUrl = `?${encode(parsedQueryParams)}`;
  updateUrl(updatedUrl);
};

/**
 * @param {string} newUrl
 */
export const updateUrl = newUrl => {
  window.realReplaceState({}, null, newUrl);
};

/**
 * @param {string} newHash
 */
export const updateHash = newHash =>
  // If the new hash is '#' or '', remove it entirely
  updateUrl(
    newHash.replace(/#$/, '') === ''
      ? window.location.href.replace(window.location.hash, '') // URL without hash
      : newHash
  );
