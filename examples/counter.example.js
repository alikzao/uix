export const id = "counter";
export const title = "Component Counter";

export const code = `class Counter extends api.Component {
  constructor() {
    super(root, {});
    this.initState({ count: 0 });
  }

  increment() {
    this.setState({ count: this.state.count + 1 });
  }

  decrement() {
    this.setState({ count: this.state.count - 1 });
  }

  render() {
    return \`
      <div style="font-family: sans-serif; padding: 16px;">
        <h3>Counter Example</h3>
        <div style="display:flex; gap:8px; align-items:center;">
          <button data-click="decrement">-</button>
          <strong style="min-width:30px; text-align:center;">\${this.state.count}</strong>
          <button data-click="increment">+</button>
        </div>
      </div>
    \`;
  }
}

new Counter();`;

