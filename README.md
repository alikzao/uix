# UIX

UIX is a tiny client-side component framework in plain JavaScript.

It gives you class-based components, local state, child components, delegated events, popup components, and a zero-build workflow that can run directly in the browser.

## Playground

- Home: [https://alikzao.github.io/uix/](https://alikzao.github.io/uix/)
- Sandbox: [https://alikzao.github.io/uix/playground/](https://alikzao.github.io/uix/playground/)
- Examples runner: [https://alikzao.github.io/uix/examples/](https://alikzao.github.io/uix/examples/)

## Features

### Component state

Create a component, keep local state, and re-render with a small API.

- Sandbox: [Counter example](https://alikzao.github.io/uix/playground/?example=counter)

```js
class Counter extends Component {
  constructor(root) {
    super(root, {});
    this.initState({ count: 0 });
  }

  increment() {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return `
      <div>
        <button data-click="increment">+</button>
        <strong>${this.state.count}</strong>
      </div>
    `;
  }
}
```

### Nested components

Compose components inside other components with `this.children` and `data-child`.

- Sandbox: [Nested components example](https://alikzao.github.io/uix/playground/?example=nested-components)

```js
class ParentCard extends Component {
  constructor(root) {
    super(root, {});
    this.children = {
      childCounter: new ChildCounter()
    };
    this.initState({});
  }

  render() {
    return `<div data-child="childCounter"></div>`;
  }
}
```

### Event binding styles

UIX supports both inline component bindings like `onClick="methodName"` and delegated events through `addEvent(...)`.

- Sandbox: [Event bindings example](https://alikzao.github.io/uix/playground/?example=event-bindings)

```js
render() {
  return `
    <div id="demo">
      <button onClick="handleInlineClick">Inline event</button>
      <button class="delegated-btn">Delegated event</button>
    </div>
  `;
}

addEvents() {
  this.addEvent("#demo", ".delegated-btn", "click", () => {
    this.handleDelegatedClick();
  });
}
```

### Popup components

Build modal and popup flows on top of the provided popup base class.

- Sandbox: [Popup example](https://alikzao.github.io/uix/playground/?example=popup)

## Why UIX

- No build step required. You can load it directly in the browser with `type="module"` and start coding.
- Plain JavaScript. No JSX, no compiler, no framework-specific language layer.
- Small footprint. `src/component.js` is about `7 KB` raw, and the whole `src/*.js` set is about `34 KB` raw.
- Easy to inspect. The framework is small enough that you can actually read the source and understand how it works.
- Low ceremony. A component is just a class with `render()`, state methods, and event hooks.
- Easy browser-first workflow. Good fit for monorepos, internal tools, admin panels, and prototypes where you want to open a page and work immediately.
- No dependency monster around the core idea. You do not need a bundler, virtual DOM stack, or plugin chain just to render UI and handle events.

## Browser-first usage

You can use UIX without any special setup.

```html
<div id="app"></div>

<script type="module">
  import { Component } from "./src/index.js";

  class HelloComponent extends Component {
    constructor(root) {
      super(root, {});
      this.initState({ name: "UIX" });
    }

    render() {
      return `<div>Hello, ${this.state.name}!</div>`;
    }
  }

  new HelloComponent("#app");
</script>
```

## Package structure

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
  examples/
  playground/
  __tests__/
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

## Compatibility

- Existing runtime imports from `modules/core/static/js/*.js` continue to work through compatibility wrappers.
- Existing class names and method signatures are preserved.
- The package lives inside the monorepo but can be split and published separately.

## License

Apache-2.0. See `LICENSE`.
