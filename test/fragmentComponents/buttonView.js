import { fragment } from '../../src/fragment.js';
import { getStyleString } from '../../src/utils.js';
import { store } from '../../src/store.js';

export function buttonView(props = {}) {
  const { text = 'Button', style: styleInput = {} } = props;
  let count = 0;
  let df = fragment`<button
    class="btn btn-primary m-2"
    style=${getStyleString(styleInput)}
  >
    ${text}
  </button>`;
  
  const button = df.querySelector('button');
  button.addEventListener('click', () => {
    count++; // local state update
    button.innerText = `You clicked me ${count} ${
      count > 1 ? 'times' : 'time'
    }`;
    store.setState((prev) => ({ count: prev.count + 1 })); // global state update
  });

  return df;
}

export default buttonView;
