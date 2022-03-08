import { html } from '../util';
import { buttonView } from './buttonView';
export function dialogView(props = {}) {
  const { title = 'Diaglot Title', content = 'Dialog content' } = props;
  let template = html`<div class="dialog">
    <h2>${title}</h2>
    <p>${content}</p>
    ${buttonView()}
    <div id="ph1"></div>
  </div>`;
  return template;
}
export default dialogView;
