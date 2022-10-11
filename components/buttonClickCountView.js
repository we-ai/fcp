import { fragment, createTemplateAndUpdateFunction } from '../util.js';
import { store } from '../store.js';

const templateFunc = ({}, { count = 0 }) => fragment`
<div class="col-md-12" onclick=${handleDivClick}>
<p>You clicked buttons ${count} ${
  count > 1 ? 'times' : 'time'}</p>
</div>`;

export function buttonClickCountView() {
  const { df, update } = createTemplateAndUpdateFunction(templateFunc);

  store.renderAfterStateChange(['count'], ([count]) => {
    update({ count });
  });

  return df;
}

function handleDivClick(e) {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    e.target.style = `background-color: #${randomColor}`;
}

export default buttonClickCountView;
