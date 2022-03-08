import { html } from '../util';
import { renderAfterStateChange } from '../store';

export function buttonClickCountView() {
  let template = html`<p></p>`;
  const p = template.querySelector('p');
  renderAfterStateChange(['count'], (count) => {
    p.textContent = `You clicked the buttons ${count} ${
      count > 1 ? 'times' : 'time'
    }`;
  });
  return template;
}
export default buttonClickCountView;
