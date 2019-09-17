// @ts-check

const PRICE_DELIMITER = '==';

/**
 * Converts a set of prices into an array by PRICE_DELIMITER
 *
 * @todo Consider accepting delimiter as an argument
 *
 * @param {string} prices e.g. '1000|499|5000'
 * @returns {Array}
 */
const getPriceList = prices => {
  if (!prices) return [];
  return prices.split(PRICE_DELIMITER).filter(price => price !== '');
};

/**
 * Converts a string number into a decimal for UI display
 *
 * @param {string} price e.g. '1000'
 * @returns {string} e.g. '10.00'
 */
export const convertToDecimal = price => {
  if (!price) return '';
  return (parseInt(price, 10) / 100).toFixed(2);
};

/**
 * Formats a price range for UI display
 *
 * e.g. '$4.99 — $19.99'
 *
 * @param {string} prices A pipe-delimited set of prices, e.g. '3.99|4.99'
 * @returns {string}
 */
export const formatPriceRange = prices => {
  if (!prices) return '';

  const priceList = getPriceList(prices);
  const minPrice = Math.min(...priceList).toString();
  const maxPrice = Math.max(...priceList).toString();

  // Handle case where the min and max are the same
  if (minPrice === maxPrice) {
    return formatPriceSingle(minPrice);
  }

  return `${formatPriceSingle(minPrice)} — ${formatPriceSingle(maxPrice)}`;
};

/**
 * Formats a single price for UI display
 *
 * e.g. '$10.00'
 *
 * @param {string} price A single price, e.g. '1000'
 * @returns {string}
 */
export const formatPriceSingle = price => {
  if (!price) return '';
  return `$${convertToDecimal(price)}`;
};
