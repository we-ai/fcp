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

  for (let i = 0; i < N; i++) {
    if (
      values[i] instanceof HTMLElement ||
      values[i] instanceof DocumentFragment
    ) {
      transformedStringList.push(inputStrings[i], `<div id="placeholder"></div>`);
      elementAndDocumentFragmentList.push(values[i]);
    } else if ( typeof values[i] === 'function' && 
              inputStrings[i].match(/on[a-z]{2,30}\s*=\s*$/) ) { 
      const [matchedString, eventString] = inputStrings[i].match(/on([a-z]{2,30})\s*=\s*$/);
      inputStrings[i] = inputStrings[i].replace(matchedString, `data-event-${eventString}${i}`);
      transformedStringList.push(inputStrings[i]);
      eventList.push({eventString, index: i, eventHandler: values[i]});
    } else {
      transformedStringList.push(inputStrings[i], values[i]);
    }
  }

  transformedStringList.push(inputStrings[N]);
  const documentFragment = stringToFragment(transformedStringList.join(''));

  if (elementAndDocumentFragmentList.length > 0) {
    const phEleList = documentFragment.querySelectorAll('#placeholder');
    for (let i = 0; i < phEleList.length; i++) {
      replaceElement(phEleList[i], elementAndDocumentFragmentList[i]);
    }
  }

  if (eventList.length > 0) {
    for (const {eventString, index, eventHandler} of eventList) {
      const eventTarget = documentFragment.querySelector(`[data-event-${eventString}${index}]`);
      eventTarget.addEventListener(eventString, eventHandler);
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

export function replaceElement(ele, ...nodeList) {
  const divEle = wrapToDiv(nodeList);
  ele.replaceWith(...divEle.children);

  return ele;
}

export function insertBefore(ele, ...nodeList) {
  const divEle = wrapToDiv(nodeList);
  ele.before(...divEle.children);

  return ele;
}

export function insertAfter(ele, ...nodeList) {
  const divEle = wrapToDiv(nodeList);
  ele.after(...divEle.children);

  return ele;
}

export function prependChildren(ele, ...nodeList) {
  const divEle = wrapToDiv(nodeList);
  ele.prepend(...divEle.children);

  return ele;
}

export function appendChildren(ele, ...nodeList) {
  const divEle = wrapToDiv(nodeList);
  ele.append(...divEle.children);

  return ele;
}

export const insertChildrenToStart = prependChildren;

export const insertChildrenToEnd = appendChildren;

export function removeAndReturnChildren(ele) {
  const divEle = document.createElement('div');
  divEle.append(...ele.children);

  return Array.from(divEle.children);
}

/**
 * 
 * @param {Node[]} nodeList 
 * @returns HTMLDivElement
 */
function wrapToDiv(nodeList) {
  let divEle = document.createElement('div');
  divEle.replaceChildren(...nodeList);

  return divEle;
}
/**
 * Create a template (`df`) and an update function (`update`).
 * @param {function} templateFunc
 * @param {object} templateProps
 * @param {object} initialState
 * @returns {[df: DocumentFragment, update: function]}
 */
export function createTemplateAndUpdate(
  templateFunc,
  templateProps = {},
  initialState = {}
) {
  const df = templateFunc(templateProps, initialState);
  let nodes = Array.from(df.children);
  let newDfRef = df;

  const update = (updatedProps = {}, updatedState = {}) => {
    const newDf = templateFunc({...templateProps, ...updatedProps}, {...initialState, ...updatedState});
    nodes = replaceNodes(nodes, Array.from(newDf.children));
    update.newDf= newDf;
  };

  return [df, update, newDfRef];
}

/**
 * Replace old nodes with new nodes.
 * @param {Node[]} oldNodes
 * @param {Node[]} newNodes
 * @returns {Node[]}
 */
export function replaceNodes(oldNodes, newNodes) {
  if (oldNodes.length === 0) {
    return oldNodes;
  }

  const wrapperDiv = document.createElement('div');
  oldNodes[oldNodes.length - 1].after(...newNodes);
  wrapperDiv.append(...oldNodes);

  return Array.from(wrapperDiv.children);
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

/**
 * Deep copy an object.
 * @param {*} input 
 * @returns 
 */
export function deepCopy(input) {

  if (typeOf(input) !== 'object') {
    return input;
  }

  let output = Array.isArray(input) ? [] : {};

  for (const key in input) {
    output[key] = deepCopy(input[key]);
  }

  return output;
};

/**
 * Further separate 'null' type from 'object' type.
 * @param {*} value 
 * @returns {"string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | "null"}
 */
export function typeOf(value) {
  let type = typeof value;

  if (value === null && type === 'object') {
    type = 'null';
  }

  return type;
}