export const id = "event-bindings";
export const title = "Event Bindings (addEvent + onClick)";

export const code = `class EventBindingsDemo extends api.Component {
  constructor() {
    super(root, {});
    this.initState({ inlineClicks: 0, delegatedClicks: 0 });
  }

  handleInlineClick() {
    this.setState({ inlineClicks: this.state.inlineClicks + 1 });
    log("onClick handler fired");
  }

  handleDelegatedClick() {
    this.setState({ delegatedClicks: this.state.delegatedClicks + 1 });
    log("addEvent delegated handler fired");
  }

  addEvents() {
    this.addEvent("#event-bindings-root", ".delegated-btn", "click", () => {
      this.handleDelegatedClick();
    });
  }

  render() {
    return \`
      <div id="event-bindings-root" style="font-family:sans-serif; padding:16px;">
        <h3 style="margin:0 0 10px 0;">Event bindings demo</h3>

        <button
          onClick="handleInlineClick"
          style="margin-right:8px;"
        >
          onClick button (\${this.state.inlineClicks})
        </button>

        <button class="delegated-btn">
          addEvent button (\${this.state.delegatedClicks})
        </button>
      </div>
    \`;
  }
}

new EventBindingsDemo();`;
