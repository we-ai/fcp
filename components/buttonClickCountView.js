import { fragment, createTemplateAndUpdate } from '../util.js';
import { store } from '../store.js';





export function buttonClickCountView() {
  let divClickCount = 0;
  let count = store.getState().count;

  const templateFunc = ({ localCount, count = 0 }) => fragment`
    <div class="col-md-12" onclick=${handleDivClick}>
    <p>You clicked buttons ${count} ${count > 1 ? 'times' : 'time'}</p>
    <p> div element click count: ${localCount}</p>
    </div>`;

  const [df, update] = createTemplateAndUpdate(templateFunc, {
    localCount: divClickCount,
    count,
  });

  store.watchStateChange(['count'], ({ count }) => {
    update({ count });
  });

  function handleDivClick(e) {
    divClickCount++;
    update({ localCount: divClickCount, count: store.getState().count });
  }
  
  return df;
}

export default buttonClickCountView;
