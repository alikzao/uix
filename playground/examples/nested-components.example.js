export const id = "nested-components";
export const title = "Nested Components";

export const code = `class ChildCounter extends api.Component {
  constructor() {
    super(null, {});
    this.initState({ count: 0 });
  }

  increment() {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return \`
      <div style="border:1px solid #d5d9e2; border-radius:10px; padding:12px; margin-top:10px;">
        <div style="font-size:14px; margin-bottom:8px;">Child counter: <strong>\${this.state.count}</strong></div>
        <button data-click="increment">Increment child</button>
      </div>
    \`;
  }
}

class ParentCard extends api.Component {
  constructor() {
    super(root, {});
    this.children = {
      childCounter: new ChildCounter()
    };
    this.initState({ title: "Parent component" });
  }

  render() {
    return \`
      <div style="font-family:sans-serif; padding:16px;">
        <h3 style="margin:0 0 8px 0;">\${this.state.title}</h3>
        <p style="margin:0 0 10px 0; color:#4d5870;">
          The child below is another component mounted with data-child.
        </p>
        <div data-child="childCounter"></div>
      </div>
    \`;
  }
}

new ParentCard();`;
