import { html, replaceElement, insertAfter } from '../util';
import { buttonView } from './buttonView';
export function dialogView(props = {}) {
  const { title = 'Diaglot Title', content = 'Dialog content' } = props;
  let template = html`<div class="dialog">
    <h2>${title}</h2>
    <p>${content}</p>
    <div id="ph1"></div>
  </div>`;
  let ph1 = template.querySelector('#ph1');
  replaceElement(ph1, buttonView());
  return template;
}
export default dialogView;
