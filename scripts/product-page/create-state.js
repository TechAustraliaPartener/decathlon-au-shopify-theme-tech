// @ts-check
/**
 * Set to `true` to debug state helper module
 */
const DEBUG = false;

/**
 * State helper module
 *
 * A factory pattern inspired helper to keep keep/update/get state. The state
 * is scoped meaning each module that uses this helper will have its own
 * individual state object to interact with.
 */

/**
 * Creates a new scoped state object
 *
 * @template T
 * @param {T} initialState The initial state
 */
export const createState = initialState => {
  /**
   * Set initial state
   */
  let state = initialState;

  /** @typedef {(newState: T) => void} CallBack */

  /** @type {CallBack[]} */
  const listeners = [];

  DEBUG && console.log('INITIAL state:', state);

  /**
   * Retrieves the module state
   *
   * @returns {T} The module state
   */
  const getState = () => state;

  /**
   * Updates the module state
   *
   * @param {Partial<T>} newState The updated state
   */
  const updateState = newState => {
    state = {
      ...state,
      ...newState
    };

    listeners.forEach(listener => listener(state));

    DEBUG && console.log('NEW state', state);
  };

  /**
   * @param {CallBack} cb
   */
  const onChange = cb => {
    listeners.push(cb);
  };

  return {
    getState,
    updateState,
    onChange
  };
};
