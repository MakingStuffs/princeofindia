import {
    msCreate,
    msAppend,
    msQuery,
    msQueryAll
} from "making-stuffs-queries";
import menuCSS from './sass/menu.ce.scss';
import sectionCSS from './sass/sections.ce.scss';
import itemCSS from './sass/items.ce.scss';
import navCSS from './sass/nav.ce.scss';
import menu from './json/menu.json';

/* global HTMLElement customElements window IntersectionObserver */

class msMenu extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({
            mode: 'open'
        });
    }

    connectedCallback() {
        if (this.isConnected) {
            msMenu.prototype.elem = this;
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
        
        this.menuToggle = this.menuToggle.bind(this);
        this.setTop = this.setTop.bind(this);
        this.changeSelection = this.changeSelection.bind(this);
        this.addOptionListeners = this.addOptionListeners.bind(this);

        const options = {
            root: null,
            threshold: 0.1,
            rootMargin: '0px'
        };

        const target = super.elem;
        const callback = (entries) => {
            entries.forEach(entry => { 
                if(entry.isIntersecting) {
                    this.inView = true;
                } else {
                    this.inView = false;
                }
            });
        };

        const observer = new IntersectionObserver(callback, options);

        observer.observe(target);

        window.addEventListener('resize', () => {
            if(window.innerWidth < 1000) {
                this.activeDiv.addEventListener('click', this.menuToggle);
                this.style.top = 'unset';
                this.style.bottom = 0;
            } else {
                this.addOptionListeners();
                this.setTop();
            }
        }, {passive: true});
    }

    static get observedAttributes() {
        return ['open', 'inView'];
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

    get inView() {
       return this.hasAttribute('inView');
    }

    set inView(isInView) {
        if(isInView) {
            this.setAttribute('inView', '');
        } else {
            this.removeAttribute('inView');
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
            msAppend([this.activeDiv, this.optionsDiv], this.wrapper);

            this.options.forEach((option, i) => {
                const elem = msCreate('div', {
                    class: 'option'
                });
                elem.innerHTML = option;
                elem.setAttribute('name', option);
                if (i === 0) {
                    msAppend([elem], this.activeDiv);
                } else {
                    msAppend([elem], this.optionsDiv);
                }
            });

            return window.innerWidth < 1000 ?
            (this.activeDiv.addEventListener('click', this.menuToggle),
            this.addOptionListeners()) :
            (this.open = true, this.addOptionListeners(), this.setTop());
        }
    }

    disconnectedCallback() {
        window.removeEventListener('resize', () => {
            if(window.innerWidth < 1000) {
                this.activeDiv.addEventListener('click', this.menuToggle);
                this.style.top = 'unset';
                this.style.bottom = 0;
            } else {
                this.addOptionListeners();
                this.setTop();
            }
        }, {passive: true});
    }

    changeSelection(e) {
        const newElem = msQuery(`ms-menu-section[name="${e.target.getAttribute('name')}"]`, this.parentElement);
        const curElem = msQuery(`ms-menu-section[active]`, this.parentElement);
        const newNavItem = msCreate('div', { class:'option', name: e.target.getAttribute('name') } );
        
        newNavItem.innerHTML = e.target.getAttribute('name');
        this.activeDiv.removeChild(this.activeDiv.lastChild);
        this.activeDiv.appendChild(newNavItem);

        curElem.active = false;
        newElem.active = true;
        
        this.open = false;
        
        this.activeDiv.firstElementChild.onclick = null;

        return this.addOptionListeners(), this.scrollToPosition();
    }

    scrollToPosition() {
        const windowY = window.pageYOffset;
        const menuY = msQuery('ms-menu').getBoundingClientRect().top;
        const scrollTo = (windowY + menuY) - 60;
        return window.scrollTo(0, scrollTo);
    }

    menuToggle() {        
        if (!this.open) {
            this.open = true;
        } else {
            this.open = false;
        }
    }

    addOptionListeners() {
        this.optionsDiv.childNodes.forEach(node => {
            if(!node.onclick) {
                node.onclick = this.changeSelection;
            }
        });
    }

    setTop() {
        const elems = msQueryAll('*');
        elems.forEach(elem => {
            if(window.getComputedStyle(elem, true).getPropertyValue('position') === 'fixed') {
                this.style.top = `${elem.offsetHeight + 20}px`;
            }
        });
    }
}

class msMenuSection extends msMenu {
    constructor() {
        super();
        this.createItems = this.createItems.bind(this);
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

            return this.createItems(dishes);
        }
    }

    createItems(dishes) {
        for (let dishObj of dishes[0].items) {
            const dishElem = msCreate('ms-menu-item');
            for (let attr in dishObj) {
                dishElem.setAttribute(attr, dishObj[attr]);
            }
            msAppend([dishElem], this.wrapper);
        }
    }
}

class msMenuItem extends msMenuSection {
    constructor() {
        super();
        const style = msCreate('style');
        style.innerHTML = itemCSS.toString();
        this.shadowRoot.appendChild(style);

        this.buildElements = this.buildElements.bind(this);
    }

    connectedCallback() {
        if (this.isConnected) {

            this.wrapper = msCreate('div', {
                class: 'wrapper'
            });

            this.attrRow = msCreate('div', {
                class: 'attr-row'
            });

            msAppend([this.wrapper], this.shadowRoot);

            return this.buildElements();
            
        }
    }

    buildElements() {
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
            msAppend([this.attrRow], this.wrapper);
        }
    }
}

customElements.define('ms-menu', msMenu);
customElements.define('ms-menu-nav', msMenuNav);
customElements.define('ms-menu-section', msMenuSection);
customElements.define('ms-menu-item', msMenuItem);