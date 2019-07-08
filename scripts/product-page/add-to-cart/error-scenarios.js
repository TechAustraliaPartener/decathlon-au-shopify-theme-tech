// @ts-check

/**
 * Shopify error scenario 1:
 * "If the product is entirely sold out"
 *
 * Shopify error `description` value:
 * `The product #{item.name} is already sold out.`
 *
 * @see https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#error-responses
 */
const ERROR_SCENARIO_1_REGEX = /^the\sproduct.*is\salready\ssold\sout\.$/i;

/**
 * Shopify error scenario 2:
 * "If the product is not sold out but the requested quantity exceeds
 * what is available, yet at least 1 item can still be added to the cart"
 *
 * Shopify error `description` value:
 * `You can only add #{item.remaining_inventory} #{item.name} to the cart.`
 *
 * @see https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#error-responses
 */
const ERROR_SCENARIO_2_REGEX = /^you\scan\sonly\sadd.*to\sthe\scart\.$/i;

/**
 * Shopify error scenario 3:
 * "If the product is not sold out, but all of its stock is in the cart"
 *
 * Shopify error `description` value:
 * `All #{item.inventory_quantity} #{item.name} are in your cart.`
 *
 * @see https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#error-responses
 */
const ERROR_SCENARIO_3_REGEX = /^all.*are\sin\syour\scart\.$/i;

/**
 * Determines if the `description` maps to Shopify error scenario 1
 *
 * @param {string} description A Shopify `description` value
 * @returns {boolean}
 */
export const isErrorScenario1 = description =>
  ERROR_SCENARIO_1_REGEX.test(description);

/**
 * Determines if the `description` maps to Shopify error scenario 2
 *
 * @param {string} description A Shopify `description` value
 * @returns {boolean}
 */
export const isErrorScenario2 = description =>
  ERROR_SCENARIO_2_REGEX.test(description);

/**
 * Determines if the `description` maps to Shopify error scenario 3
 *
 * @param {string} description A Shopify `description` value
 * @returns {boolean}
 */
export const isErrorScenario3 = description =>
  ERROR_SCENARIO_3_REGEX.test(description);
