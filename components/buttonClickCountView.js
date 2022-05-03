import { html } from '../util';
import { store } from '../store';

export function buttonClickCountView() {
  let count = store.getState().count;
  const template = html`<p>Count the total clicks of buttons.</p>`;

  // Hold the reference to p
  const p = template.querySelector('p');
  store.subscribe(
    (state) => state.count,
    (count) => {
      p.textContent = `You clicked me ${count} ${count > 1 ? 'times' : 'time'}`;
    }
  );
  return template;
}
export default buttonClickCountView;
