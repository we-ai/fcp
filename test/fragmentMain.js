// import './style.scss';
import { fragment } from '../src/fragment.js';
import { aboutView, buttonView, buttonClickCountView } from './fragmentComponents/index.js';

const app = document.querySelector('#app');

let rootFragment = fragment`
  <div class="container">
    ${aboutView({ content: 'Funcitonal Components are awesome!' })}
    <div class="row">
      <div class="col-md-6">${buttonView({ text: 'Button1' })}</div>
      <div class="col-md-6">${buttonView({ text: 'Button2' })}</div>
    </div>
    <div class="row">${buttonClickCountView()}</div>
  </div>
`;

app.appendChild(rootFragment);
