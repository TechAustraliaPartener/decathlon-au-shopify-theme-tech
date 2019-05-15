/**
 * Set to `true` to debug state helper module
 */
const DEBUG = false;

/**
 * State helper module
 *
 * A factory pattern inspired helper to keep keep/set/get state.
 *
 * @param {Object} [initialState={}] The initial state
 * @returns {Object} API for interacting with state
 */
export const createState = (initialState = {}) => {
  /**
   * Set initial state
   */
  let state = initialState;

  DEBUG && console.log('INITIAL state:', state);

  /**
   * Retreives the module state
   *
   * @returns {Object} The module state
   */
  const getState = () => state;

  /**
   * Updates the module state
   *
   * @param {Object} [newState={}] The updated state
   */
  const updateState = (newState = {}) => {
    state = {
      ...state,
      ...newState
    };

    DEBUG && console.log('NEW state', state);
  };

  return {
    getState,
    updateState
  };
};
