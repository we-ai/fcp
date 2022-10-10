import { fragment } from '../util';
import { store } from '../store';

export function buttonClickCountView() {
  let count = store.getState().count;
  const df = fragment`<p>Count the total clicks of buttons.</p>`;

  // Hold the reference to p
  const pEle = df.querySelector('p');
  store.subscribe(
    (state) => state.count,
    (count) => {
      pEle.innerText = `You clicked ${count} ${count > 1 ? 'times' : 'time'}`;
    }
  );
  return df;
}

export default buttonClickCountView;
