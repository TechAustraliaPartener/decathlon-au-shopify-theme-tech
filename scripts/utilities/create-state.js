// @ts-check

import { DEBUG } from '../shared/config';

/**
 * State helper module
 *
 * A factory pattern inspired helper to keep keep/update/get state. The state
 * is scoped meaning each module that uses this helper will have its own
 * individual state object to interact with.
 */

/** @typedef {any[]} DepsArray */

/**
 * @param {DepsArray} oldDeps
 * @param {DepsArray} newDeps
 */
const depsChanged = (oldDeps, newDeps) =>
  !oldDeps || newDeps.some((dep, index) => oldDeps[index] !== dep);

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
  /** @typedef {(newState: T) => DepsArray} GetDeps */
  /** @typedef {{ lastDeps?: DepsArray, getDeps?: GetDeps }} Listener */

  /** @type {Map<CallBack, Listener>} */
  const listeners = new Map();

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

    // We are batching the listeners to prevent the listeners from being called multiple times per tick
    // For example if we do
    // state.updateState({foo: 'bar'});
    // state.updateState({asdf: '1234'})
    // then the listeners on that state will now only get fired once in that tick
    // Promise.resolve().then(cb) enqueues a microtask to run the cb
    // See the step by step demo here: https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
    if (!listenersQueued) {
      listenersQueued = true;
      Promise.resolve().then(() => {
        flushUpdates();
      });
    }

    if (DEBUG) console.log('NEW state', state);
  };

  /**
   * Fires all the state listener callbacks which depend on state that has changed
   */
  const flushUpdates = () => {
    listeners.forEach(({ getDeps, lastDeps }, cb) => {
      // GetDeps is optional, so if it doesn't exist we call cb on _every_ state change
      if (!getDeps) return cb(state);
      const newDeps = getDeps(state);
      listeners.set(cb, {
        getDeps,
        lastDeps: newDeps
      });
      if (depsChanged(lastDeps, newDeps)) cb(state);
    });
    listenersQueued = false;
  };

  updateFlushers.push(flushUpdates);

  /**
   * @param {CallBack} cb
   * @param {GetDeps} [getDeps] Function that is passed state and returns an array of dependencies.
   *   If any of those dependencies has changed since the last state, cb will be invoked again.
   *   Similar to React's useEffect hook https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect
   */
  const onChange = (cb, getDeps) => {
    listeners.set(cb, { getDeps });
  };

  return {
    getState,
    updateState,
    onChange
  };
};

/** @type {(() => void)[]} */
const updateFlushers = [];

/**
 * Synchronously flush all batched updates for all createState() instances. Useful for testing.
 */
export const flushAllUpdates = () => {
  updateFlushers.forEach(flush => flush());
};
