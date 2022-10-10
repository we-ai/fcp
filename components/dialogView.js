import { fragment } from '../util.js';
import { buttonView } from './buttonView.js';

export function dialogView(props = {}) {
  const { title = 'Diaglog Title', content = 'Dialog content' } = props;
  let df = fragment`<div class="dialog">
    <h2>${title}</h2>
    <p>${content}</p>
    ${buttonView()}
    <div id="ph1"></div>
  </div>`;

  return df;
}

export default dialogView;
