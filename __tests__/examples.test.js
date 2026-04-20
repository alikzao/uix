import { jest } from "@jest/globals";
import { examples, examplesById, defaultExampleId } from "../examples/index.js";

describe("examples registry", () => {
    test("contains at least one example and stable default id", () => {
        expect(Array.isArray(examples)).toBe(true);
        expect(examples.length).toBeGreaterThan(0);
        expect(examplesById[defaultExampleId]).toBeDefined();
    });

    test("every example has id, title and code", () => {
        for (const example of examples) {
            expect(typeof example.id).toBe("string");
            expect(example.id.length).toBeGreaterThan(0);
            expect(typeof example.title).toBe("string");
            expect(example.title.length).toBeGreaterThan(0);
            expect(typeof example.code).toBe("string");
            expect(example.code.length).toBeGreaterThan(0);
        }
    });
});

describe("examples smoke execution", () => {
    const createApi = () => {
        class Component {
            constructor(root, props = {}) {
                this.el = root;
                this.props = props;
                this.state = {};
                this.children = {};
            }
            initState(state) {
                this.state = { ...state };
            }
            setState(nextState) {
                this.state = { ...this.state, ...nextState };
            }
            addEvent() {}
            renderComponent() {}
        }

        class PopupComponent {
            constructor() {
                this.id = "test-popup-id";
            }
            open() {}
        }

        class FunctionalComponent extends Component {
            constructor(root, setup, props = {}) {
                super(root, props);
                this.setup = setup;
                this._hooks = [];
                this._hookIndex = 0;
            }

            useState(initialValue) {
                const index = this._hookIndex++;
                if (this._hooks.length <= index) {
                    this._hooks.push({
                        state: typeof initialValue === "function" ? initialValue() : initialValue
                    });
                }

                const setValue = (nextValue) => {
                    const currentValue = this._hooks[index].state;
                    this._hooks[index].state = typeof nextValue === "function" ? nextValue(currentValue) : nextValue;
                };

                return [this._hooks[index].state, setValue];
            }

            useMethods(methods = {}) {
                Object.entries(methods).forEach(([name, handler]) => {
                    this[name] = handler.bind(this);
                });
            }

            useChildren(children = {}) {
                this.children = children;
            }

            useEvents() {}

            render() {
                this._hookIndex = 0;
                return this.setup({
                    useState: this.useState.bind(this),
                    useMethods: this.useMethods.bind(this),
                    useChildren: this.useChildren.bind(this),
                    useEvents: this.useEvents.bind(this),
                    addEvent: this.addEvent.bind(this),
                    props: this.props,
                    component: this,
                    el: this.el
                });
            }

            mount() {
                this.el.innerHTML = this.render();
            }
        }

        const createComponent = (root, setup, props = {}, options = {}) => {
            const component = new FunctionalComponent(root, setup, props);
            if (options.autoRender !== false && root && typeof root.appendChild === "function") {
                const node = { innerHTML: "" };
                component.el = node;
                component.mount();
                root.appendChild(node);
            }
            return component;
        };

        return { Component, PopupComponent, FunctionalComponent, createComponent };
    };

    test("counter example executes", () => {
        const root = { appendChild: jest.fn() };
        const api = createApi();
        const code = examplesById.counter.code;

        expect(() => {
            const run = new Function("api", "root", "log", code);
            run(api, root, () => {});
        }).not.toThrow();
    });

    test("popup example executes with a minimal document mock", () => {
        const root = { appendChild: jest.fn() };
        const api = createApi();
        const addEventListener = jest.fn();

        global.document = {
            createElement: () => ({ style: {}, innerHTML: "" }),
            getElementById: () => ({ addEventListener })
        };

        const code = examplesById.popup.code;

        expect(() => {
            const run = new Function("api", "root", "log", code);
            run(api, root, () => {});
        }).not.toThrow();
        expect(root.appendChild).toHaveBeenCalledTimes(1);
        expect(addEventListener).toHaveBeenCalledTimes(1);

        delete global.document;
    });

    test("nested components example executes", () => {
        const root = { appendChild: jest.fn() };
        const api = createApi();
        const code = examplesById["nested-components"].code;

        expect(() => {
            const run = new Function("api", "root", "log", code);
            run(api, root, () => {});
        }).not.toThrow();
    });

    test("event bindings example executes", () => {
        const root = { appendChild: jest.fn() };
        const api = createApi();
        const code = examplesById["event-bindings"].code;

        expect(() => {
            const run = new Function("api", "root", "log", code);
            run(api, root, () => {});
        }).not.toThrow();
    });

    test("functional component example executes", () => {
        const root = { appendChild: jest.fn() };
        const api = createApi();
        const code = examplesById["functional-component"].code;

        expect(() => {
            const run = new Function("api", "root", "log", code);
            run(api, root, () => {});
        }).not.toThrow();
    });
});
