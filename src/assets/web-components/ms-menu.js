import {
    msCreate,
    msAppend,
    msQuery
} from "making-stuffs-queries";
import menuCSS from './sass/menu.ce.scss';
import sectionCSS from './sass/sections.ce.scss';
import itemCSS from './sass/items.ce.scss';
import navCSS from './sass/nav.ce.scss';
import menu from '../json/menu.json';

/* global HTMLElement customElements window console document*/

class msMenu extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({
            mode: 'open'
        });
    }

    connectedCallback() {
        if (this.isConnected) {
            this.nav = msCreate('ms-menu-nav');
            const style = msCreate('style');
            const wrapper = msCreate('div', {
                class: 'wrapper'
            });
            style.innerHTML = menuCSS.toString();

            this.shadowRoot.appendChild(style);
            this.shadowRoot.appendChild(wrapper);

            const navLinks = [];
            wrapper.appendChild(this.nav);

            menu.items.forEach((item, i) => {
                const elem = msCreate('ms-menu-section', {
                    name: item.name,
                    description: item.description
                });
                if (i === 0) elem.setAttribute('active', '');
                navLinks.push(item.name);
                wrapper.appendChild(elem);
            });

            this.nav.setAttribute('links', navLinks);
        }

    }

    disconnectedCallback() {

    }
}

class msMenuNav extends msMenu {
    constructor() {
        super();
        const style = msCreate('style');
        style.innerHTML = navCSS.toString();
        msAppend([style], this.shadowRoot);

        this.wrapper = msCreate('div', {
            class: 'wrapper'
        });
        msAppend([this.wrapper], this.shadowRoot);

        const allElems = document.querySelectorAll('*');
        for(let elem of allElems) {
            if(window.getComputedStyle(elem, null).getPropertyValue('position') === 'fixed') {
                this.wrapper.style.top = `${elem.offsetHeight}px`;
            }
        }
        
        this.menuToggle = this.menuToggle.bind(this);
        this.changeSelection = this.changeSelection.bind(this);
    }

    static get observedAttributes() {
        return ['open'];
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        if (oldValue !== newValue) {
            return this[attr] = this.hasAttribute(attr);
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

    connectedCallback() {
        if (this.isConnected) {
            this.options = this.getAttribute('links').split(',');
            this.optionsDiv = msCreate('div', {
                class: 'options'
            });
            this.activeDiv = msCreate('div', {
                class: 'active'
            });

            this.activeDiv.addEventListener('click', this.menuToggle);
            msAppend([this.activeDiv, this.optionsDiv], this.wrapper);

            this.options.forEach((option, i) => {
                const elem = msCreate('div', {
                    class: 'option'
                });
                elem.innerHTML = option;
                elem.setAttribute('name', option);
                if (i === 0) {
                    msAppend([elem], this.activeDiv)
                } else {
                    msAppend([elem], this.optionsDiv);
                }
            });
        }
    }

    disconnectedCallback() {
    }

    changeSelection(e) {
        let newElem = msQuery(`ms-menu-section[name="${e.target.getAttribute('name')}"]`, this.parentElement);
        let curElem = msQuery(`ms-menu-section[active]`, this.parentElement);
        let curNavItem = msQuery('.option', this.activeDiv);
        let newNavItem = msQuery(`[name="${e.target.getAttribute('name')}"]`, this.optionsDiv);
        
        this.activeDiv.appendChild(newNavItem);
        this.optionsDiv.appendChild(curNavItem);

        curElem.active = false;
        newElem.active = true;
        this.open = false;

        this.activeDiv.firstElementChild.onclick = null;
    }

    menuToggle() {
        if (!this.open) {
            this.open = true;
            this.optionsDiv.childNodes.forEach(node => {
                if(!node.onclick) {
                    node.onclick = this.changeSelection;
                }
            });
        } else {
            this.open = false;
        }
    }
}

class msMenuSection extends msMenu {
    constructor() {
        super();
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
            this.classList.add('active');
            this.setAttribute('active', '');
        } else {
            this.classList.remove('active');
            this.removeAttribute('active');
        }
    }

    connectedCallback() {
        if (this.isConnected) {
            this.wrapper = msCreate('div', {
                class: 'wrapper'
            });
            this.heading = msCreate('h3', {
                class: 'heading'
            });
            this.heading.innerHTML = this.getAttribute('name');
            this.description = msCreate('p');
            this.description.innerHTML = this.getAttribute('description');

            const style = msCreate('style');
            style.innerHTML = sectionCSS.toString();

            this.shadowRoot.appendChild(style);

            msAppend([this.wrapper], this.shadowRoot);
            msAppend([this.heading], this.wrapper);
            msAppend([this.description], this.wrapper);

            const dishes = menu.items.filter(item => {
                if (this.getAttribute('name') == item.name) {
                    return item.items;
                }
            });

            for (let dishObj of dishes[0].items) {
                const dishElem = msCreate('ms-menu-item');
                for (let attr in dishObj) {
                    dishElem.setAttribute(attr, dishObj[attr]);
                }
                msAppend([dishElem], this.wrapper);
            }


        }
    }

    disconnectedCallback() {

    }
}

class msMenuItem extends msMenuSection {
    constructor() {
        super();
        const style = msCreate('style');
        style.innerHTML = itemCSS.toString();
        this.shadowRoot.appendChild(style);
    }

    connectedCallback() {
        if (this.isConnected) {

            this.wrapper = msCreate('div', {
                class: 'wrapper'
            });

            this.attrRow = msCreate('div', {
                class: 'attr-row'
            });

            for (let attr of this.attributes) {
                switch (attr.name) {
                    case 'name':
                        var heading = msCreate('h3');
                        heading.innerHTML = attr.value;
                        this.wrapper.prepend(heading);
                        break;
                    case 'description':
                        var desc = msCreate('p');
                        desc.innerHTML = attr.value;
                        msAppend([desc], this.wrapper);
                        break;
                    case 'price':
                        var price = msCreate('p', {
                            class: 'price'
                        });
                        price.innerHTML = attr.value;
                        msAppend([price], this.wrapper);
                        break;
                    case 'taste':
                        var tasteRow = msCreate('div', {
                            class: 'taste-row'
                        });
                        var tasteHead = msCreate('h4');
                        tasteHead.innerHTML = 'Heat:';
                        msAppend([tasteHead], tasteRow);
                        msAppend([tasteRow], this.attrRow);
                        var taste = msCreate('span', {
                            class: `taste ${attr.value.toLowerCase()}`
                        });
                        taste.innerHTML = attr.value;
                        msAppend([taste], tasteRow);
                        break;
                    case 'diet':
                        var dietRow = msCreate('div', {
                            class: 'diet-row'
                        });
                        var dietHead = msCreate('h4');
                        dietHead.innerHTML = 'Dietary Notes:';
                        msAppend([dietHead], dietRow);
                        msAppend([dietRow], this.attrRow);
                        (attr.value).split(',').forEach(option => {
                            var opt = msCreate('span', {
                                class: `diet ${option.toLowerCase()}`
                            });
                            opt.innerHTML = option;
                            msAppend([opt], dietRow);
                        });
                        break;
                    case 'options':
                        var optRow = msCreate('div', {
                            class: 'options-row'
                        });
                        var optHead = msCreate('h4');
                        optHead.innerHTML = 'Options:';
                        msAppend([optHead], optRow);
                        msAppend([optRow], this.attrRow);
                        (attr.value).split(',').forEach(option => {
                            var opt = msCreate('span', {
                                class: `option ${option.toLowerCase()}`
                            });
                            opt.innerHTML = option;
                            msAppend([opt], optRow);
                        });
                        break;
                    default:
                        break;
                }
            }

            msAppend([this.attrRow], this.wrapper);
            msAppend([this.wrapper], this.shadowRoot);

        }
    }

    disconnectedCallback() {

    }
}

customElements.define('ms-menu', msMenu);
customElements.define('ms-menu-nav', msMenuNav);
customElements.define('ms-menu-section', msMenuSection);
customElements.define('ms-menu-item', msMenuItem);