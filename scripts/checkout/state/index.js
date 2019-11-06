/**
 * Allows debugging of app/UI state
 * @todo: Can this be configured via environment variable?
 * Set to `false` for `production`.
 */
const Shopify = window.Shopify;
const checkoutStep = Shopify && Shopify.Checkout && Shopify.Checkout.step;
const checkoutPage = Shopify && Shopify.Checkout && Shopify.Checkout.page;
const DEBUG_STATE = true;

const logState = () => {
  if (!DEBUG_STATE) return;
  console.info('STATE:', STATE);
};

/**
 * @todo Refactor to not use getters/setters per feedback
 * @see https://github.com/decathlon-usa/shopify-theme-decathlonusa/pull/101#discussion_r253569982
 */
const STATE = {
  _deliveryMethod: window.deliveryMethod === 'Delivery' ? 'ship' : 'pickup',
  _pickupStore: !!localStorage.getItem('favoritedStore')
    ? JSON.parse(localStorage.getItem('favoritedStore')).id
    : null,
  //_pickupStore: null,
  /**
   * For the purposes of steps and pages, don't use setters and getters
   */
  checkoutStep,
  checkoutPage,
  /**
   * Getters/Setters
   */
  get deliveryMethod() {
    return this._deliveryMethod;
  },
  get pickupStore() {
    return this._pickupStore;
  },
  set deliveryMethod(method) {
    return false;
  },
  set pickupStore(store) {
    this._pickupStore = store;
    logState();
  }
};

if (STATE._pickupStore === null && STATE._deliveryMethod === 'pickup') {
  window.location.href = '/cart';
}

export default STATE;
