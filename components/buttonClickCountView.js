import { fragment, createTemplateAndUpdateFunction } from '../util.js';
import { store } from '../store.js';

const templateFunc = ({}, { count = 0 }) => fragment`
<div class="col-md-12">
${pView(count)}
</div>`;

const pView = (count) => {
  const df = fragment`<p>You clicked buttons ${count} ${
    count > 1 ? 'times' : 'time'
  }</p>`;
  return df;
};

export function buttonClickCountView() {
  const { df, update } = createTemplateAndUpdateFunction(templateFunc);

  // event listener
  const divEle= df.querySelector('div');
  divEle.addEventListener('click', (e) => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    e.target.style = `background-color: #${randomColor}`;
  });

  store.renderAfterStateChange(['count'], ([count]) => {
    update({ count });
  });

  return df;
}

export default buttonClickCountView;
