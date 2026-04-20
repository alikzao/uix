export const id = "functional-component";
export const title = "Functional Component";

export const code = `const badge = api.createComponent(null, ({ useState }) => {
  const [value] = useState("Nested functional child");

  return \`
    <div style="margin-top:12px; padding:10px 12px; border:1px solid #d5d9e2; border-radius:10px;">
      \${value}
    </div>
  \`;
}, {}, { autoRender: false });

api.createComponent(root, ({ useState, useMethods, useEvents, useChildren }) => {
  const [count, setCount] = useState(0);
  const [delegatedCount, setDelegatedCount] = useState(0);

  useMethods({
    increment() {
      setCount((value) => value + 1);
    }
  });

  useEvents(({ addEvent }) => {
    addEvent("#functional-demo", ".delegated-btn", "click", () => {
      setDelegatedCount((value) => value + 1);
    });
  });

  useChildren({
    badge
  });

  return \`
    <div id="functional-demo" style="font-family:sans-serif; padding:16px;">
      <h3 style="margin:0 0 10px 0;">Functional UIX component</h3>
      <p style="margin:0 0 12px 0; color:#4d5870;">
        State, inline events, delegated events, and child components without a class.
      </p>

      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <button onClick="increment">onClick count: \${count}</button>
        <button class="delegated-btn">addEvent count: \${delegatedCount}</button>
      </div>

      <div data-child="badge"></div>
    </div>
  \`;
});`;
