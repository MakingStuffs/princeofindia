import {
    msCreate,
    msQuery
} from 'making-stuffs-queries';
import SCSS from './sass/main.ce.scss';
/* global HTMLElement console customElements setTimeout */
class MsModal extends HTMLElement {
    constructor() {
        super();

        // Attach a shadow DOM
        this.shadow = this.attachShadow({
            mode: 'open'
        });

        // Make and then attach the style element
        const style = msCreate('style');
        style.innerHTML = SCSS.toString();
        this.shadow.appendChild(style);

    }

    connectedCallback() {
        if (this.isConnected) {
            // Get the wrapper and append it to the shadow
            this.wrapper = msQuery('.wrapper', this);
            this.shadow.appendChild(this.wrapper);

            // Create a close button
            this.closeBtn = msCreate('button', {
                class: 'close',
                id: 'close'
            });
            this.closeBtn.innerHTML = 'Close';
            this.wrapper.appendChild(this.closeBtn);
            this.closeBtn.addEventListener('click', () => {
                this.open = false;
                setTimeout(() => this.remove(), 300);
            });

            // Open the modal to allow animate in
            setTimeout(() => this.open = true, 50);
        }
    }

    disconnectedCallback() {
        console.log('bye');
        this.closeBtn.removeEventListener('click', () => {
            this.open = false;
            setTimeout(() => this.remove(), 350);
        });
    }

    static get observedAttributes() {
        return ['open'];
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        if (oldValue !== newValue) {
            this[attr] = this.hasAttribute(attr);
        }
    }

    get open() {
        return this.hasAttribute('open');
    }
    set open(isOpen) {
        if (isOpen) {
            this.setAttribute('open', '');
        } else {
            this.removeAttribute('open');
        }
    }
}

customElements.define('ms-modal', MsModal);