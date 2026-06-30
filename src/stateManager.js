// This state manager is inspired by zustand (https://github.com/pmndrs/zustand)
import { deepCopy, isDeepEqual } from './utils.js';

export default function createStore(initialState = {}) {
  let state = deepCopy(initialState);
  const listeners = new Set();

  const set = (update, replace) => {
    const currSlice = typeof update === 'function' ? update(state) : update;

    if (currSlice !== state) {
      const prevState = state;
      state = replace ? currSlice : { ...state, ...currSlice };
      listeners.forEach((listener) => listener(state, prevState));
    }

  };

  const get = () => state;

  /**
   * Subscribe to changes in a selected slice of state.
   *
   * @example
   * const unsubscribe = appState.subscribe((state) => state.theme, (theme) => renderTheme(theme));
   * unsubscribe(); // to stop listening:
   *
   * @param {Function} selector - Selects a slice of state to observe.
   * @param {Function} handler - Called with the new slice value when it changes.
   * @param {boolean} [persist=false] - If true, the listener persists across state clears.
   * @returns {Function} Unsubscribe function that removes the listener when called.
   */
  const subscribe = (selector, handler, persist = false) => {
    if (typeof selector !== 'function' || typeof handler !== 'function') {
      throw new Error('Selector and handler must be functions.');
    }

    let prevSlice = selector(state);
    const listener = (state) => {
      const currSlice = selector(state);
      if (!isDeepEqual(currSlice, prevSlice)) {
        handler(currSlice, prevSlice);
        prevSlice = currSlice;
      }
    };

    listener.persist = persist;
    listeners.add(listener);

    return () => listeners.delete(listener);
  };

  const clear = () => {
    state = deepCopy(initialState);
    listeners.forEach((listener) => {
      if (!listener.persist) listeners.delete(listener);
    });
  };

  const destroy = () => {
    listeners.clear();
  };

  const store = {
    set,
    setState: set,
    get,
    getState: get,
    subscribe,
    clear,
    destroy,
  };

  return store;
}
