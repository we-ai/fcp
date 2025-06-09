export function replaceNode(ele, ...nodeList) {
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
 * Replace old nodes with new nodes.
 * @param {Node[]} oldNodes
 * @param {Node[]} newNodes
 * @returns {Node[]}
 */
export function replaceNodeList(oldNodes, newNodes) {
  if (oldNodes.length === 0) {
    return oldNodes;
  }

  const wrapperDiv = document.createElement('div');
  oldNodes[oldNodes.length - 1].after(...newNodes);
  wrapperDiv.append(...oldNodes);

  return Array.from(wrapperDiv.children);
}

export function copyAttributes(toEle, fromEle) {
  const attributes = Array.from(fromEle.attributes);
  for (const {name, value} of attributes) {
    toEle.setAttribute(name, value);
  }
}

export function copyClasses(toEle, fromEle) {
  const classes = Array.from(fromEle.classList);
  for (const className of classes) {
    toEle.classList.add(className);
  }
}

export function copyStyles(toEle, fromEle) {
  const styles = Array.from(fromEle.style);
  for (const st of styles) {
    toEle.style[st] = fromEle.style[st];
  }
}

export function copyDataSet(toEle, fromEle) {
  const dataSet = Array.from(fromEle.dataset);
  for (const ds of dataSet) {
    toEle.dataset[ds] = fromEle.dataset[ds];
  }
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
 * Deeply compare two objects for equality.
 * @param {object} obj1 
 * @param {object} obj2 
 * @returns boolean
 */
export function deepCompare(obj1, obj2) {
  if (obj1 === obj2) return true;

  if (typeOf(obj1) !== typeOf(obj2) || typeOf(obj1) !== 'object') return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepCompare(obj1[key], obj2[key])) return false;
  }

  return true;
}

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

