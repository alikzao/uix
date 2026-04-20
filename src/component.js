export class Component {

    constructor(selectorOrElement, props = {}) {
        if (selectorOrElement === null) {
            this.el = null;
        } else if (typeof selectorOrElement === 'string') {
            this.el = document.querySelector(selectorOrElement);
            if (!this.el) {
                throw new Error(`Элемент с селектором "${selectorOrElement}" не найден.`);
            }
        } else if (selectorOrElement instanceof HTMLElement) {
            this.el = selectorOrElement;
        } else {
            throw new Error('Неверно указан контейнер компонента');
        }
        this.props = props;
        this.state = {};
        this.rootElement = null;
        this.children = {};
        this.currentEventHandlers = [];
        this._reducers = [];
        this._reducerIndex = 0;
    }

    initState(state) {
        if (!this.state) {
            this.state = this.createReactiveState(state);
        }
        Object.assign(this.state, state);
        this.renderComponent();
    }

    setState(newState) {
        Object.assign(this.state, newState);
        this.renderComponent();
    }

    renderComponent() {
        if (!this.el) {
            return;
        }
        this.mount();
        this.bindEvents();
        this.attachChildren();
        this.componentUpdate();
        this.detachEvents();
        this.addEvents();
        this._reducerIndex = 0;
    }

    bindEvents() {
        if (!this.el) {
            return;
        }
        const elements = this.el.querySelectorAll('[data-click], [onClick], [onInput], [onChange]');

        elements.forEach(el => {
            // Handle data-click as the preferred click binding mechanism.
            if (el.hasAttribute('data-click')) {
                const methodName = el.getAttribute('data-click');
                if (typeof this[methodName] === 'function') {
                    el.addEventListener('click', (event) => this[methodName](event));
                }
            }

            // Handle generic onEvent attributes such as onClick/onInput/onChange.
            Array.from(el.attributes).forEach(attr => {
                if (attr.name.startsWith('on')) {
                    const eventType = attr.name.slice(2).toLowerCase();
                    const methodName = attr.value;
                    if (typeof this[methodName] === 'function') {
                        el.addEventListener(eventType, (event) => this[methodName](event));
                    }
                }
            });
        });
    }

    useReducer(reducer, initialState) {
        const index = this._reducerIndex;
        if (this._reducers.length <= index) {
            this._reducers.push({ state: initialState });
        }
        const state = this._reducers[index].state;
        const dispatch = (action) => {
            const currentState = this._reducers[index].state;
            this._reducers[index].state = reducer(currentState, action);
            this.setState({});
        };
        this._reducerIndex++;
        return [state, dispatch];
    }

    mount(){
        if (!this.el) {
            return;
        }
        this.el.innerHTML = this.render();
    }

    createReactiveState(state){
        return new Proxy(state, {
            set: (target, key, value) => {
                target[key] = value;
                this.update(key);
                return true;
            }
        });
    }

    update(key) {
        if (!this.el) {
            return;
        }
        const elements = this.el.querySelectorAll(`[data-bind="${key}"]`);
        elements.forEach(el => {
            el.textContent = this.state[key];
        });
    }

    render() {
        return `<div>Empty Component</div>`;
    }

    attachChildren() {
        if (!this.el) {
            return;
        }
        if (this.children) {
            Object.keys(this.children).forEach(key => {
                const child = this.children[key];
                const container = this.el.querySelector(`[data-child="${key}"]`);
                if (container) {
                    child.el = container;
                    if (typeof child.initState === 'function' && !child.state) {
                        child.initState(child.initialState || {});
                    } else {
                        child.mount();
                        child.bindEvents();
                    }
                }
            });
        }
    }

    addEvents() {}

    attachEvents() {}

    componentUpdate() {}

    unmount() {
        if (this.rootElement) {
            this.rootElement.innerHTML = '';
        }
    }

    dispose() {}

    addEvent(parentSelector, selectorOrElement, eventType, handler) {
        const parentElement = document.querySelector(parentSelector);
        if (!parentElement) return;

        // Create one delegated listener on the parent and match descendants at runtime.
        const delegatedHandler = (event) => {
            let currentElement = event.target;
            // Walk up from event.target until the parent is reached.
            while (currentElement && currentElement !== parentElement) {
                // If selectorOrElement is a selector, match against it.
                if (typeof selectorOrElement === 'string') {
                    if (currentElement.matches(selectorOrElement)) {
                        // Execute the handler in this component context.
                        handler.call(this, event);
                        event.stopPropagation();
                        return;
                    }
                } else {
                    // If an element instance is passed, compare by identity.
                    if (currentElement === selectorOrElement) {
                        handler.call(this, event);
                        event.stopPropagation();
                        return;
                    }
                }
                // Continue climbing up the DOM tree.
                currentElement = currentElement.parentNode;
            }
        };
        // Avoid duplicate delegated bindings with the same key tuple.
        const isAlreadyAdded = this.currentEventHandlers.some(registered =>
            registered.element === parentElement &&
            registered.eventType === eventType &&
            registered.selector === selectorOrElement
        );
        // Register once and keep a reference for later cleanup.
        if (!isAlreadyAdded) {
            parentElement.addEventListener(eventType, delegatedHandler);
            this.currentEventHandlers.push({element: parentElement, eventType: eventType, method: delegatedHandler, selector: selectorOrElement});
        }
    }

    detachEvents() {
        this.currentEventHandlers.forEach(handler => {
            const {element, eventType, method} = handler;
            element.removeEventListener(eventType, method);
        });
        this.currentEventHandlers = [];
    }
}
