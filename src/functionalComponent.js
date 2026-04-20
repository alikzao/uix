import { Component } from './component.js';

export class FunctionalComponent extends Component {

    constructor(selectorOrElement, setup, props = {}) {
        super(selectorOrElement, props);

        if (typeof setup !== 'function') {
            throw new Error('Functional component setup must be a function.');
        }

        this.setup = setup;
        this._hooks = [];
        this._hookIndex = 0;
        this._functionalEventBinder = null;
    }

    _nextHook(initialValue) {
        const index = this._hookIndex;

        if (this._hooks.length <= index) {
            this._hooks.push({
                state: typeof initialValue === 'function' ? initialValue() : initialValue
            });
        }

        this._hookIndex++;
        return [this._hooks[index], index];
    }

    useState(initialValue) {
        const [hookState, index] = this._nextHook(initialValue);

        const setValue = (nextValue) => {
            const currentValue = this._hooks[index].state;
            this._hooks[index].state = typeof nextValue === 'function'
                ? nextValue(currentValue)
                : nextValue;
            this.renderComponent();
        };

        return [hookState.state, setValue];
    }

    useReducer(reducer, initialState) {
        const [hookState, index] = this._nextHook(initialState);

        const dispatch = (action) => {
            const currentValue = this._hooks[index].state;
            this._hooks[index].state = reducer(currentValue, action);
            this.renderComponent();
        };

        return [hookState.state, dispatch];
    }

    useMethods(methods = {}) {
        const boundMethods = {};

        Object.entries(methods).forEach(([name, handler]) => {
            if (typeof handler !== 'function') {
                return;
            }

            const boundHandler = handler.bind(this);
            this[name] = boundHandler;
            boundMethods[name] = boundHandler;
        });

        return boundMethods;
    }

    useChildren(children = {}) {
        this.children = children;
        return this.children;
    }

    useEvents(registerEvents) {
        if (typeof registerEvents === 'function') {
            this._functionalEventBinder = registerEvents;
        }
    }

    render() {
        this._hookIndex = 0;
        this._functionalEventBinder = null;
        this.children = {};

        const context = {
            props: this.props,
            component: this,
            el: this.el,
            useState: this.useState.bind(this),
            useReducer: this.useReducer.bind(this),
            useMethods: this.useMethods.bind(this),
            useChildren: this.useChildren.bind(this),
            useEvents: this.useEvents.bind(this),
            addEvent: this.addEvent.bind(this)
        };

        return this.setup(context) || '';
    }

    addEvents() {
        if (typeof this._functionalEventBinder === 'function') {
            this._functionalEventBinder({
                component: this,
                addEvent: this.addEvent.bind(this)
            });
        }
    }
}

export function createComponent(selectorOrElement, setup, props = {}, options = {}) {
    const component = new FunctionalComponent(selectorOrElement, setup, props);

    if (options.autoRender !== false && component.el) {
        component.renderComponent();
    }

    return component;
}

export function component(selectorOrElement, setup, props = {}, options = {}) {
    return createComponent(selectorOrElement, setup, props, options);
}
