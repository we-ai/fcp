import { fragment } from '../util';

export function aboutView(props = {}) {
  const { content = 'John Doe' } = props;
  let df = fragment`<h2>${content}</h2>`;

  return df;
}

export default aboutView;
