import mainSCSS from './sass/main.ce.scss';
import slideSCSS from './sass/slide.ce.scss';
import {
    msCreate,
    msQuery,
    msQueryAll
} from 'making-stuffs-queries';

class MsBooking extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({
            mode: 'open'
        });
        this.updateProps = this.updateProps.bind(this);
    }

    connectedCallback() {
        if (this.isConnected) {
            MsBooking.prototype.state = {};
            const template = msQuery('.template', this).cloneNode(true);
            const style = msCreate('style');
            let props = {
                action: this.getAttribute('action'),
                method: this.getAttribute('method'),
                enctype: this.getAttribute('enctype'),
            };

            style.innerHTML = mainSCSS.toString();
            template.classList = 'wrapper'

            this.shadow.appendChild(style);
            this.shadow.appendChild(template);
            this.updateProps(props);
        }
    }

    disconnectedCallback() {
        console.log('Bye');
    }

    updateProps(newState) {
        for (let data in newState) {
            this.state[data] = newState[data];
        }
    }

    props() {
        return this.state;
    }
}

class MsBookingSlide extends MsBooking {
    constructor() {
        super();
        this.boundClickHandler = this.clickHandler.bind(this);
        this.changeSlide = this.changeSlide.bind(this);
        this.updateState = this.updateState.bind(this);
        this.confirmInput = this.confirmInput.bind(this);
        this.boundSubmitHandler = this.submitHandler.bind(this);
    }

    static get observedAttributes() {
        return ['active'];
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        if (oldValue !== newValue) {
            return this[attr] = this.hasAttribute(attr);
        }
    }

    get active() {
        return this.hasAttribute('active');
    }

    set active(isActive) {
        if (isActive) {
            this.setAttribute('active', '');
        } else {
            this.removeAttribute('active');
        }
    }

    connectedCallback() {
        if (this.isConnected) {
            const style = msCreate('style');
            style.innerHTML = slideSCSS.toString();
            this.shadowRoot.appendChild(style);
            this.wrapper = msQuery('.wrapper', this);
            this.shadowRoot.appendChild(this.wrapper);
            const buttons = msQueryAll('button', this.shadowRoot);
            buttons.forEach(button => {
                button.addEventListener('click', this.boundClickHandler)
            });
        }
    }

    disconnectedCallback() {
        this.console.log('bye');
    }

    clickHandler(e) {
        e.preventDefault();
        const action = e.target.dataset.action;
        switch (action) {
            case 'next':
                if (this.dataset.type === 'input') {
                    this.updateState();
                    this.changeSlide(action);
                } else {
                    this.changeSlide(action);
                }
                break;
            case 'back':
                break;
            case 'send':
                break;
            default:
                break;
        }
    }

    changeSlide(action) {
        const currentIndex = parseInt(this.dataset.index);
        let nextSlideIndex = action === 'next' ? currentIndex + 1 : currentIndex - 1;
        const nextSlide = msQuery(`ms-booking-slide[data-index="${nextSlideIndex}"]`, this.parentElement);
        if (nextSlide.dataset.type === 'confirm') this.confirmInput(nextSlide);
        this.active = false;
        nextSlide.active = true;
    }

    updateState() {
        let data, elem, key;
        switch (this.dataset.type) {
            case 'input':
                elem = msQuery('input', this.shadowRoot);
                data = elem.value;
                key = elem.getAttribute('name');
                super.updateProps({
                    [key]: data
                });
                break;
            default:
                break;
        }
    }

    confirmInput(nextSlide) {
        const state = super.props();
        const form = msCreate('form', {
            class: 'confirm-container',
            action: state.action,
            method: state.method,
            enctype: state.enctype
        });
        const submit = msCreate('input', {
            type: 'submit',
            class: 'button'
        });
        const nextSlideWrapper = msQuery('.wrapper', nextSlide.shadowRoot);
        for (let prop in state) {

            if (prop === 'action' || prop === 'method' || prop === 'enctype') continue;

            const row = msCreate('div', {
                class: 'confirm-row'
            });
            const fieldName = (prop.split(/(?=[A-Z])/g)).join(' ');
            row.innerHTML = `
                <label>${fieldName}:</label> <input value="${state[prop]}" name="${prop}" />
            `;
            form.appendChild(row);
        }
        form.appendChild(submit);
        nextSlideWrapper.appendChild(form);
        form.addEventListener('submit', this.boundSubmitHandler);
    }

    async submitHandler(e) {
        e.preventDefault();
        const fields = e.currentTarget.elements;
        let body = {};

        for(let field of fields){
            if(field.type === 'submit') continue;
            body[field.name] = field.value;
        }

        const reply = await fetch('https://localhost:60002/auth', {
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await reply.json();

        console.log(data);
    }
}

customElements.define('ms-booking', MsBooking);
customElements.define('ms-booking-slide', MsBookingSlide);