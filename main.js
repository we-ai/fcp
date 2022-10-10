import './style.scss';
import { appendChildren, fragment } from './util.js';
import { aboutView, buttonView, buttonClickCountView } from './components';

const app = document.querySelector('#app');
let df = fragment`
  <div class="container">
    ${aboutView({ content: 'Funcitonal Components are awesome!' })}
    <div class="row">
      <div class="col-md-6">${buttonView({ text: 'Button1' })}</div>
      <div class="col-md-6">${buttonView({ text: 'Button2' })}</div>
    </div>
    <div class="row">${buttonClickCountView()}</div>
  </div>
`;
appendChildren(app, df);
