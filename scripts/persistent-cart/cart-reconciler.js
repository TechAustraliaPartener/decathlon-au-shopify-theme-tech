// @ts-check

/**
 * @typedef {Object} LineItem - Item variant and quantity objects, formatted for
 * using in a Shopify Ajax API query
 * @property {number} id - A variant ID
 * @property {number} quantity - A quantity for a variant (line item) in a cart
 */

/**
 * Get items from a Shopify cart or the cart in the DB
 * Note that the cart returned by a webhook does not match the
 * structure of a cart returned by the AJAX API
 * @param {Item[]} items - Items extracted from a cart
 * @returns {LineItem[]} - Query-ready line-item objects
 */
const getLineItems = items => {
  return items.map(({ variant_id: id, quantity }) => ({
    id,
    quantity
  }));
};

/**
 * Get items from a cart
 * @param {Cart} cart - A Shopify cart
 * @returns {Item[] | []}
 */
const getItemsFromCart = cart =>
  (cart && (cart.items || cart.line_items)) || [];

// @TODO - implement and remove comments
/**
 * Merges two carts to produce a merged object of line-item details (variant_id and quantity)
 * This array should be used to update an existing Shopify cart in a single request
 * @see https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#update-cart
 * @param {Object|null} cart1 - One cart to reconcile
 * @param {Object|null} cart2 - Another cart to reconcile
 * @returns {Object.<string,number>} mergedCart - Object of line_item key/value pairs,
 * where the key is a variant_id (id property) the value is a quantity.
 * If the variant_id of two line items is identical, the quantity will be accumulated to a single line_item
 */
export const cartReconciler = (cart1, cart2) => {
  /**
   * Get the line items for both carts (Our DB and from Shopify),
   * as an array of objects with ids an quantities
   */
  const combinedCart = [
    ...getLineItems(getItemsFromCart(cart1)),
    ...getLineItems(getItemsFromCart(cart2))
  ];
  /**
   * Merge Shopify and DB cart line_item objects to a single array,
   * combining quantities for identical line_items
   */
  return combinedCart.reduce((acc, curr) => {
    // Does the current item's id exist on the accumulated object?
    const matching = acc[curr.id];
    // If so, add to quantity for the existing ID, else add this id to the
    // add the current quantity to a matching item or to 0 if it doesn't exist
    acc[curr.id] = (matching || 0) + curr.quantity;
    return acc;
  }, {});
};
