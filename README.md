# fcp

Functional Component Practices

## Install

```sh
npm install fcp
```

## Usage

```js
import { fragment, createStore } from 'fcp';

const view = fragment`
  <button type="button">Click me</button>
`;

document.body.append(view);

const store = createStore({ count: 0 });
store.subscribe(
  (state) => state.count,
  (count) => console.log(count)
);
store.set((state) => ({ count: state.count + 1 }));
```

## Exports

- `fcp`: main public API.
- `fcp/fragment`: fragment helpers.
- `fcp/state`: store factory.
- `fcp/store`: default singleton store.
- `fcp/utils`: DOM and object utilities.
