/**
 * Query string module
 *
 * Provides helpers for interacting with URL paramaters
 */

/**
 * Parses variant id out of the URL
 */
export const getUrlVariant = () => {
  /**
   * Selects the term "variant=" from the URL if it is preceded by ?, &, or /
   * followed by variant id indicated by anything until & or #, which is
   * captured and returned.
   */
  const regex = new RegExp('[\\?&]variant=([^&#]*)', 'i');
  const results = regex.exec(window.location.search);
  return results === null ? '' : parseInt(results[1], 10);
};

/**
 * Updates the variant id in the URL when a new variant is selected
 *
 * @param {string} variantId The variant ID
 */
export const updateUrlVariant = variantId => {
  const updatedUrl = addOrReplaceParam(
    window.location.href,
    'variant',
    variantId
  );
  window.history.pushState(null, null, updatedUrl);
};

/**
 * Updates or adds a parameter to a url string
 *
 * @param {string} fullUrl The url to update or add parameter to
 * @param {string} paramKey The name of the parameter
 * @param {string} paramValue The value of the parameter
 *
 * @returns {string} The updated URL
 */
function addOrReplaceParam(fullUrl, paramKey, paramValue) {
  const urlParts = fullUrl.split('#');
  const url = urlParts[0];
  const urlHash = urlParts[1] === undefined ? '' : `#${urlParts[1]}`;
  /**
   * Selects the param provided from the URL if it is preceded by ?, &, or /
   * followed by = and anything until & or #. Captures delimeter for url
   * rebuild.
   */
  const regex = new RegExp(`([\\?&])${paramKey}=[^&#]*`, 'i');
  const queryString = url.split('?')[1];
  let separator = '';
  if (queryString === undefined) {
    separator = '?';
  } else if (queryString !== '') {
    separator = '&';
  }
  let newUrl = '';
  if (url.match(regex)) {
    newUrl = url.replace(regex, `$1${paramKey}=${paramValue}`);
  } else {
    newUrl = `${url}${separator}${paramKey}=${paramValue}`;
  }
  return `${newUrl}${urlHash}`;
}
