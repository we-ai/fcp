import { fragment } from '../util.js';

export function cardView(props = {}) {
  const {
    class: className = '',
    cardTitle = 'Card Title',
    cardContent = 'Card content',
    imgSrc = '...',
    linkHref = '#',
    linkText = 'Link text',
  } = props;

  let df = fragment`
    <div class="d-flex justify-content-center ${className}">
      <div class="card">
        <img src=${imgSrc} class="card-img-top" alt="..." />
        <div class="card-body">
          <h5 class="card-title">${cardTitle}</h5>
          <p class="card-text">${cardContent}</p>
          <a href=${linkHref} class="btn btn-primary">${linkText}</a>
        </div>
      </div>
      <div></div>
    </div>
  `;

  return df;
}

export default cardView;
