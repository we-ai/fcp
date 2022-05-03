import { html, getStyleString } from '../util';
import { store } from '../store';
export function buttonView(props = {}) {
  const { text = 'Button', style: styleInput = {} } = props;
  let count = 0;
  let template = html`<button
    class="btn btn-primary m-2"
    style=${getStyleString(styleInput)}
  >
    ${text}
  </button>`;
  
  const button = template.querySelector('button');
  button.addEventListener('click', () => {
    count++; // local state update
    button.textContent = `You clicked me ${count} ${
      count > 1 ? 'times' : 'time'
    }`;
    store.setState((prev) => ({ count: prev.count + 1 })); // global state update
  });
  return template;
}

export default buttonView;
