const template = document.createElement("template");
template.innerHTML = `
<style>

label{
  display: flex;
  align-items: center;
}

input[type="checkbox"]{
  vertical-align: middle;
}

.remove{
  cursor: pointer;
  text-decoration: none !important;
}

</style>
<label>
  <input type="checkbox" />
  <slot></slot>
</label>
<span class="remove">
  &#10006;
</span>
`;

class ToDoItem extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({mode: "open"});
    shadow.append(template.content.cloneNode(true));
    this.checkbox = shadow.querySelector("input");
    this.removeBtn = shadow.querySelector(".remove");
    this.label = shadow.querySelector("label");
  }

  static get observedAttributes() {
    return ["checked"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "checked") {
      this.updateChecked(newValue);
      this.dispatchEvent(
        new CustomEvent("item-checked", {
          detail: {oldValue, newValue},
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  connectedCallback() {
    this.checkbox.addEventListener(
      "change",
      this.changeAttributeChecked.bind(this)
    );

    this.removeBtn.addEventListener("click", this.removeTodoItem.bind(this));
  }

  disconnectedCallback() {
    this.setAttribute("checked", false);
    this.checkbox.removeEventListener("change", this.changeAttributeChecked);
    this.checkbox.removeEventListener("click", this.removeTodoItem);
  }

  updateChecked(value) {
    this.checkbox.checked = value != null && value !== "false";
    this.checkbox.checked
      ? (this.label.style.textDecoration = "line-through")
      : (this.label.style.textDecoration = "none");
  }

  changeAttributeChecked(e) {
    this.setAttribute("checked", e.currentTarget.checked);
  }

  removeTodoItem() {
    this.setAttribute("checked", false);
    this.remove();
  }
}

customElements.define("todo-item", ToDoItem);
