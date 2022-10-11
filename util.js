/**
 * Use tag template to parses a string into HTML elements
 * @param {string[]} inputStrings
 * @param  {any[]} values
 * @returns {DocumentFragment}
 */
export function fragment(strings, ...values) {
  const N = values.length;
  let inputStrings= strings.slice();
  let transformedStringList = [];
  let elementAndDocumentFragmentList = [];
  let eventList=[];

  // If HTML elements are found, save them in an array
  for (let i = 0; i < N; i++) {
    if (
      values[i] instanceof HTMLElement ||
      values[i] instanceof DocumentFragment
    ) {
      transformedStringList.push(inputStrings[i], `<div id="placeholder"></div>`);
      elementAndDocumentFragmentList.push(values[i]);
    } else if ( typeof values[i] === 'function' && inputStrings[i].match(/on[a-z]{2,20}\s*=\s*$/) ) { 
      const [matchedString, eventString] = inputStrings[i].match(/on([a-z]{2,20})\s*=\s*$/);
      inputStrings[i] = inputStrings[i].replace(matchedString, `data-event-id=${i}`);
      transformedStringList.push(inputStrings[i]);
      eventList.push({eventString, callback: values[i]});
    } else {
      transformedStringList.push(inputStrings[i], values[i]);
    }
  }

  transformedStringList.push(inputStrings[N]);
  let documentFragment = stringToFragment(transformedStringList.join(''));

  if (elementAndDocumentFragmentList.length > 0) {
    const phEleList = documentFragment.querySelectorAll('#placeholder');
    for (let i = 0; i < phEleList.length; i++) {
      replaceElement(phEleList[i], elementAndDocumentFragmentList[i]);
    }
  }

  if (eventList.length > 0) {
    const eventEleList = documentFragment.querySelectorAll('[data-event-id]');

    for (let i = 0; i < eventEleList.length; i++) {
      const eventEle = eventEleList[i];
      const {eventString, callback} = eventList[i];
      eventEle.addEventListener(eventString, callback);
    }
  }

  return documentFragment;
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
/**
 * Create a template (`df`) and an update function (`update`).
 * @param {function} templateFunc
 * @param {object} templateProps
 * @param {object} initialState
 * @returns {{df: DocumentFragment, update: function}}
 */
export function createTemplateAndUpdateFunction(
  templateFunc,
  templateProps = {},
  initialState = {}
) {
  const df = templateFunc(templateProps, initialState);
  let nodes = Array.from(df.children);

  const update = (updatedState = {}) => {
    const newDf = templateFunc(templateProps, updatedState);
    nodes = replaceNodes(nodes, Array.from(newDf.children));
  };

  return { df, update };
}

/**
 * Replace old nodes with new nodes.
 * @param {Node[]} oldNodes
 * @param {Node[]} newNodes
 * @returns {Node[]}
 */
export function replaceNodes(oldNodes, newNodes) {
  while (oldNodes.length > 1) {
    oldNodes.pop().remove();
  }

  if (oldNodes.length === 1) {
    oldNodes[0].replaceWith(...newNodes);
    return newNodes;
  }

  return oldNodes;
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
