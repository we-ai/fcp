// This file was developed based on the following projects:
// - uhtml (https://github.com/WebReflection/uhtml)
// - Lit DOM Expressions (https://github.com/ryansolid/dom-expressions/tree/main/packages/lit-dom-expressions)
// - lit-html (https://github.com/lit/lit/tree/main/packages/lit-html)

export function html(strings, ...values) {
  const valueLength = values.length;
  // let inputStrings= strings.slice();
  let transformedStringList = [];
  let elementAndDocumentFragmentList = [];
  let eventList=[];

  for (let i = 0; i < valueLength; i++) {
const str = strings[i];

  }


}

/**
 * 
 * @param {HTMLElement | DocumentFragment} target 
 * @param {*} template 
 */
export function render(target, template) {
  target.append(template);
}


const template = () => html`<div>hello</div>`;