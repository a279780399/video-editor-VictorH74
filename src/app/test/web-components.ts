
customElements.define("slider", class extends HTMLElement {
    constructor() {
        super()

        this.attachShadow({ mode: "open" });

        const wrapper = document.createElement("span");
        wrapper.setAttribute("class", "wrapper");
        const icon = wrapper.appendChild(document.createElement("span"));
        icon.setAttribute("class", "icon");
        icon.setAttribute("tabindex", 0);
        // Insert icon from defined attribute or default icon
        const img = icon.appendChild(document.createElement("img"));

        img.src = (this.hasAttribute("img")
            ? this.getAttribute("img")
            : "img/default.png") as string;

    }
})