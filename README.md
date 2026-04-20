# Core Components

Internal monorepo package for the client component framework.

## Playground

- Home: [https://alikzao.github.io/uix/](https://alikzao.github.io/uix/)
- Sandbox (code left, result right): [https://alikzao.github.io/uix/playground/](https://alikzao.github.io/uix/playground/)

## Structure

```text
components/
  src/
    component.js
    extendedComponent.js
    popupComponent.js
    treeManager.js
    emitter.js
    socketService.js
    index.js
  package.json
  README.md
```

## Public API

- `Component`
- `ExtendedComponent`
- `PopupComponent`
- `TreeManager`
- `Emitter`
- `socketService`

## Minimal Example

```js
import { Component } from './src/index.js';

class HelloComponent extends Component {
  constructor(root) {
    super(root, {});
    this.initState({ name: 'UIX' });
  }

  render() {
    return `<div>Hello, ${this.state.name}!</div>`;
  }
}

new HelloComponent('#app');
```

## Compatibility

- Existing runtime imports from `/modules/core/js/*.js` remain valid through re-export wrappers in `modules/core/static/js`.
- Existing class names and method signatures are preserved.
- The package is private and intended to live inside the monorepo.

## License

Apache-2.0. See `LICENSE`.
