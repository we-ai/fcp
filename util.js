/**
 * Use tag template to parses a string into HTML elements
 * @param {string[]} strings
 * @param  {any[]} values
 * @returns {DocumentFragment}
 */
export function fragment(strings, ...values) {
  const N = values.length;
  let transformedStringList = [];
  let elementAndDocumentFragmentList = [];

  // If HTML elements are found, save them in an array
  for (let i = 0; i < N; i++) {
    if (
      values[i] instanceof HTMLElement ||
      values[i] instanceof DocumentFragment
    ) {
      transformedStringList.push(strings[i], `<div id="placeholder"></div>`);
      elementAndDocumentFragmentList.push(values[i]);
    } else {
      transformedStringList.push(strings[i], values[i]);
    }
  }

  transformedStringList.push(strings[N]);
  let fragment = stringToFragment(transformedStringList.join(''));

  if (elementAndDocumentFragmentList.length > 0) {
    const phEleList = fragment.querySelectorAll('#placeholder');
    for (let i = 0; i < phEleList.length; i++) {
      replaceElement(phEleList[i], elementAndDocumentFragmentList[i]);
    }
  }

  return fragment;
}

/**
 * Parses a string into HTML elements and wraps them in DocumentFragment.
 * @param {string} str - The string to parse.
 * @returns {DocumentFragment}
 */
export function stringToFragment(str) {
  const doc = new DOMParser().parseFromString(str, 'text/html');
  const fragment = new DocumentFragment();
  fragment.append(...doc.body.children);
  return fragment;
}

export function replaceElement(ele, ...nodes) {
  const divEle = wrapToDiv(nodes);
  ele.replaceWith(...divEle.children);
  
  return ele;
}

export function insertBefore(ele, ...nodes) {
  const divEle = wrapToDiv(nodes);
  ele.before(...divEle.children);
  
  return ele;
}

export function insertAfter(ele, ...nodes) {
  const divEle = wrapToDiv(nodes);
  ele.after(...divEle.children);
  
  return ele;
}

export function prependChildren(ele, ...nodes) {
  const divEle = wrapToDiv(nodes);
  ele.prepend(...divEle.children);

  return ele;
}

export function appendChildren(ele, ...nodes) {
  const divEle = wrapToDiv(nodes);
  ele.append(...divEle.children);
  
  return ele;
}

export const insertChildrenToStart = prependChildren;

export const insertChildrenToEnd = appendChildren;

export function removeChildren(ele) {
  while (ele.firstChild) {
    ele.firstChild.remove();
  }
 
  return ele;
}

function wrapToDiv(nodes) {
  let divEle = document.createElement('div');

  for (const node of nodes) {
    divEle.appendChild(node);
  }

  return divEle;
}

export function getStyleString(style) {
  let styleList = [];
  if (typeof style === 'object') {
    for (let key in style) {
      styleList.push(`${key}: ${style[key]}`);
    }
  } else if (typeof style === 'string') {
    let splitted = style.replace(/\n/g, ' ').split(';');

    for (let s of splitted) {
      let [k, v] = s.split(':');
      if (k && v) styleList.push(`${k}: ${v}`);
    }
  }

  return styleList.join(';');
}

export function dispatchEventWithData(element, eventName, data = {}) {
  const event = new CustomEvent(eventName, {
    detail: data,
    bubbles: true,
    cancelable: true,
  });

  return element.dispatchEvent(event);
}
