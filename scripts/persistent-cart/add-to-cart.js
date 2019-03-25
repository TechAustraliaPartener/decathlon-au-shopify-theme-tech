import isPlainObject from 'lodash.isplainobject';

/**
 * Sets up decorators or listeners on the AJAX Add-To-Cart functionality
 * of the Shopify store. If an add-to-cart event is detected, this
 * will call the initialization of the Persistent Cart client,
 * which will then determine whether to add a customer to the persistent-cart app
 * database, with the newly updated cart.
 *
 * This is needed for cases when a new customer logs in with an empty cart,
 * adds one or more items to their cart, and never reloads the page during
 * that session.
 *
 * @see /assets/ajax-cart.js(.liquid) for reference
 * @param {function(number)} persistentCartInit - An initialization function (callback) from
 * the main JS.
 * Takes the line_item quantity from an item successfully added to the cart.
 * This callback is called after an item is added to the cart using AJAX (no page reload).
 */

const onCartAjaxUpdated = persistentCartInit => {
  // Check for the ShopifyAPI object, and abort if it does not exist
  const ShopifyAPI = window.ShopifyAPI;
  if (!ShopifyAPI || !ShopifyAPI.addItemFromForm) {
    return;
  }
  /**
   * Decorates function arguments to Shopify.addItemFromForm
   * Finds which argument to those functions is a Shopify line_item
   * This value is obtained during the triggering of the callback (function),
   * which is passed to the "success" property of the jQuery AJAX call used
   * by the Shopify.addItemFromForm method - aka, the "add-to-cart" AJAX success event
   *
   * @param {function} fn - A function that is an argument to ShopifyAPI.addItemFromForm
   * @returns {function} - The decorated function argument to Shopify.addItemFromForm.
   * Success adding an item can now be captured used to trigger the Persistent Cart,
   * to add a customer to the database without a page reload.
   */
  const argDecorator = fn => (...args) => {
    // Check that this argument is a product by checking both variant_id and quantity properties
    const lineItemObject = args.find(
      // Ensure that arg is a JS object before using prop in object checks
      arg => isPlainObject(arg) && 'variant_id' in arg && 'quantity' in arg
    );
    if (lineItemObject) {
      // Initialize the application, passing in the quantity of the item just added to the cart
      persistentCartInit(lineItemObject.quantity);
    }
    return fn(...args);
  };
  /**
   * Map over the arguments of the Shopify.addItemFromForm method.
   * For arguments that are functions, pass to another decorator
   * which detects which argument of that function is a product that
   * was added to the cart via AJAX. This is the signal that an
   * item was added to the cart.
   * @param {...*} args - The original arguments passed to ShopifyAPI.addItemFromForm
   * @returns {function} - The decorated addItemFromForm method
   */
  const originalShopifyAddItemFromForm = ShopifyAPI.addItemFromForm;
  ShopifyAPI.addItemFromForm = (...args) => {
    const newArgs = args.map(arg =>
      typeof arg === 'function' ? argDecorator(arg) : arg
    );
    return originalShopifyAddItemFromForm(...newArgs);
  };
};

export default onCartAjaxUpdated;
