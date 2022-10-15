import createStore from './stateManager.js';

let startState = { count: 0 };
let store = createStore(startState);

/**
 * 
 * @param {string[]} keyList 
 * @param {function} callback 
 */
function watchStateChange(keyList, callback) {
  store.subscribe((state) => {
    if (keyList.length === 0) return state;
    
    let values = {};
    keyList.forEach((key) => {values[key] = state[key]});

    return values;
  }, callback);
}

window.onbeforeunload = (e) => {
  store.destroy();
};

store.watchStateChange = watchStateChange;

export { store, watchStateChange};
export default store;
