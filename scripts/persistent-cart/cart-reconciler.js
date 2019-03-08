/**
 * Get items from a Shopify cart or the cart in the DB
 * Note that the cart returned by a webhook does not match the
 * structure of a cart returned by the AJAX API
 * @param {Object} cart - A cart from the DB or AJAX API
 * @returns {Object[]} lineItems(aka, line_items, items) - The items from the cart,
 * @returns {string} items[].id - The variant_id of an item
 * @returns {string} items[].quantity - The quantity of an item
 */
const getLineItems = cart => {
  const items = (cart && (cart.items || cart.line_items)) || [];
  // eslint-disable-next-line camelcase
  return items.map(({ variant_id, quantity }) => ({
    id: variant_id,
    quantity
  }));
};

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
const cartReconciler = (cart1, cart2) => {
  /**
   * Get the line items for both carts (Our DB and from Shopify),
   * as an array of objects with ids an quantities
   */
  const combinedCart = [...getLineItems(cart1), ...getLineItems(cart2)];
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

export default cartReconciler;
