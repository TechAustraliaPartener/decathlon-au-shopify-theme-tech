// @ts-check
/**
 * Set to `true` to debug state helper module
 */
const DEBUG = process.env.DEBUG === 'true';

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

  let listenersQueued = false;

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

    listenersQueued = true;

    // We are batching the listeners to prevent the listeners from being called multiple times per tick
    // For example if we do
    // state.updateState({foo: 'bar'});
    // state.updateState({asdf: '1234'})
    // then the listeners on that state will now only get fired once in that tick
    // Promise.resolve().then(cb) enqueues a microtask to run the cb
    // See the step by step demo here: https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
    Promise.resolve().then(() => {
      if (listenersQueued) {
        listeners.forEach(listener => listener(state));
        listenersQueued = false;
      }
    });

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
