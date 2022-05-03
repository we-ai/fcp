// This state manager was inspired by zustand (https://github.com/pmndrs/zustand)
export default function createStore(startState = {}) {
  let state = startState;
  const listeners = new Set();

  const setState = (update, replace) => {
    const currState = typeof update === 'function' ? update(state) : update;
    if (currState !== state) {
      const prevState = state;
      state = replace ? currState : { ...state, ...currState };
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
