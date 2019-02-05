/**
 * Allows debugging of app/UI state
 * @todo: Can this be configured via environment variable?
 * Set to `false` for `production`.
 */
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
  _deliveryMethod: null,
  _pickupStore: null,
  _checkoutStep: null,
  /**
   * Getters/Setters
   */
  get deliveryMethod() {
    return this._deliveryMethod;
  },
  get pickupStore() {
    return this._pickupStore;
  },
  get checkoutStep() {
    return this._checkoutStep;
  },
  set deliveryMethod(method) {
    this._deliveryMethod = method;
    logState();
  },
  set pickupStore(store) {
    this._pickupStore = store;
    logState();
  },
  set checkoutStep(step) {
    this._checkoutStep = step;
    logState();
  }
};

export default STATE;
