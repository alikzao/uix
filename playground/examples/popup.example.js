export const id = "popup";
export const title = "Popup Component";

export const code = `class DemoPopup extends api.PopupComponent {
  constructor() {
    super(null, { size: "small", onCloseRequest: false });
  }

  bottomBarBtn() {
    return \`\`;
  }

  content() {
    return \`
      <div class="popup-sub-content">
        <label style="color:#000; font-weight:700; grid-column:1 / 4;">UIX Popup</label>
        <input type="text" placeholder="Try typing here..." />
        <button id="cancel-\${this.id}" style="grid-column:1 / 4; margin-top:12px;">Close</button>
      </div>
    \`;
  }
}

const wrap = document.createElement("div");
wrap.style.padding = "16px";
wrap.innerHTML = '<h3 style="font-family:sans-serif;">Popup Example</h3><button id="openPopup">Open popup</button>';
root.appendChild(wrap);

const popup = new DemoPopup();
document.getElementById("openPopup").addEventListener("click", () => popup.open());`;
