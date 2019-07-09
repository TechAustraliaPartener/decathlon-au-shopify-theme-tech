/**
 * Return a URL for a thumbnail image, given a Shopify Image URL
 * @param {string} url - A Shopify Image URL
 * @returns {string} - A modified URL
 */
export const getThumbnailImageSrc = url => {
  // @TODO - Test for use of 100x or x100 (check this) and use 100x instead of small to create
  const smallThumbRegEx = /[_small|_100x]\./;
  const imageSuffixRegEx = /(\.[jpg|jpeg|gif|png|webp])/;
  if (smallThumbRegEx.test(url)) {
    return url;
  }
  return url.replace(imageSuffixRegEx, '_100x$1');
};
