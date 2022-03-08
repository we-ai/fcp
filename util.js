/**
 * Use tag template to parses a string into HTML elements
 * @param {string[]} strings
 * @param  {any[]} values
 * @returns {DocumentFragment}
 */
export function html(strings, ...values) {
  const N = values.length;
  let transformedStringList = [];
  let elementsAndDocumentFragments = [];
  // If HTML elements are found, save them in an array
  for (let i = 0; i < N; i++) {
    if (
      values[i] instanceof HTMLElement ||
      values[i] instanceof DocumentFragment
    ) {
      transformedStringList.push(strings[i], `<div id="placeholder"></div>`);
      elementsAndDocumentFragments.push(values[i]);
    } else {
      transformedStringList.push(strings[i], values[i]);
    }
  }
  transformedStringList.push(strings[N]);
  let template = stringToHTML(transformedStringList.join(''));
  if (elementsAndDocumentFragments.length > 0) {
    let phs = template.querySelectorAll('#placeholder');
    for (let i = 0; i < phs.length; i++) {
      replaceElement(phs[i], elementsAndDocumentFragments[i]);
    }
  }
  return template;
}

/**
 * Parses a string into HTML elements and wraps them in DocumentFragment.
 * @param {string} str - The string to parse.
 * @returns {DocumentFragment}
 */
export function stringToHTML(str) {
  const doc = new DOMParser().parseFromString(str, 'text/html');
  const fragment = new DocumentFragment();
  fragment.append(...doc.body.children); // append all children elements in doc.body
  return fragment;
}

export function replaceElement(ele, ...nodes) {
  const div = wrapToDiv(nodes);
  ele.replaceWith(...div.children);
  return ele;
}
export function insertBefore(ele, ...nodes) {
  const div = wrapToDiv(nodes);
  ele.before(...div.children);
  return ele;
}

export function insertAfter(ele, ...nodes) {
  const div = wrapToDiv(nodes);
  ele.after(...div.children);
  return ele;
}

export function prependChildren(ele, ...nodes) {
  const div = wrapToDiv(nodes);
  ele.prepend(...div.children);
  return ele;
}

export function appendChildren(ele, ...nodes) {
  const div = wrapToDiv(nodes);
  ele.append(...div.children);
  return ele;
}

export const insertChildrenToStart = prependChildren;

export const insertChildrenToEnd = appendChildren;

function wrapToDiv(nodes) {
  let div = document.createElement('div');
  for (let node of nodes) {
    if (node instanceof DocumentFragment) {
      div.appendChild(node); //appendChild() works for DocumentFragment and Node
    } else {
      div.append(node); //append() works for HTMLElement and DOMString
    }
  }
  return div;
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
  var event = new CustomEvent(eventName, {
    detail: data,
    bubbles: true,
    cancelable: true,
  });
  return element.dispatchEvent(event);
}
