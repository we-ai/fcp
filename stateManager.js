// This state manager was inspired by zustand (https://github.com/pmndrs/zustand)
import { deepCopy } from './utils.js';

export default function createStore(initialState = {}) {
  let state = deepCopy(initialState);
  const listeners = new Set();

  const setState = (update, replace) => {
    const currSlice = typeof update === 'function' ? update(state) : update;

    if (currSlice !== state) {
      const prevState = state;
      state = replace ? currSlice : { ...state, ...currSlice };
      listeners.forEach((listener) => listener(state, prevState));
    }

  };

  const getState = () => state;

  const subscribeListener = (listener) => {
    listeners.add(listener);

    return () => listeners.delete(listener);
  };

  const subscribe = (selector, optionalListener) => {
    let listener = selector;
    if (optionalListener) {
      let currentSlice = selector(state);
      listener = (state) => {
        const nextSlice = selector(state);
        
        if (currentSlice !== nextSlice) {
          const prevSlice = currentSlice;
          currentSlice = nextSlice;
          optionalListener(currentSlice, prevSlice);
        }
      };
    }

    return subscribeListener(listener);
  };

  const destroy = () => listeners.clear();

  const store = {
    setState,
    getState,
    subscribe,
    destroy,
  };

  return store;
}
