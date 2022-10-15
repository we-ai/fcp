import {isEqual} from '../lib/underscore.js';
import { replaceNode, replaceNodeList, deepCopy } from "./utils.js";

/**
 * Use tag template to parses a string into HTML DocumentFragment
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
      replaceNode(phEleList[i], elementAndDocumentFragmentList[i]);
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

/**
 * Create a template (`df`) and an update function (`update`).
 * @param {function} templateFunc
 * @param {object} templateProps
 * @param {object} initialState
 * @returns {[df: DocumentFragment, update: function]}
 */
 export function createTemplateAndUpdate(
  templateFunc,
  initialProps = {}
) {
  let templateState = deepCopy(initialProps);
  let df = templateFunc(templateState);
  let nodes = Array.from(df.children);
  let newDf;

  // todo: handle event listeners attached to nodes in df
  const update = (updatedProps) => {
    const updatedTemplateState = {...templateState, ...updatedProps};

    if (isEqual(updatedTemplateState, templateState)) {
      return;
    }

    templateState = updatedTemplateState;

    // update nodes using updatedFragmentState, or create new nodes and replace old nodes
    newDf = templateFunc(templateState);
    const newNodes = Array.from(newDf.children);
    replaceNodeList(nodes, newNodes);
    nodes = newNodes;
  };

  return [df, update];


}