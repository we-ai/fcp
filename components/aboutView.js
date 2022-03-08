import { html } from '../util';
export function aboutView(props = {}) {
  const { content = 'John Doe' } = props;
  let template = html`<h2>${content}</h2>`;

  return template;
}
export default aboutView;
