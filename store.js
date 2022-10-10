import createStore from './stateManager.js';

let startState = { count: 0 };
let store = createStore(startState);

/**
 * 
 * @param {string[]} stateSliceList 
 * @param {function} callback 
 */
function renderAfterStateChange(stateSliceList, callback) {
  store.subscribe((state) => {
    if (stateSliceList.length === 0) return state;
    let values = [];
    for (let s of stateSliceList) {
      values.push(state[s]);
    }
    return values;
  }, callback);
}

window.onbeforeunload = (e) => {
  store.destroy();
};

store.renderAfterStateChange = renderAfterStateChange;

export { store, renderAfterStateChange };
export default store;
