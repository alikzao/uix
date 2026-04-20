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
            }
            initState(state) {
                this.state = { ...state };
            }
            setState(nextState) {
                this.state = { ...this.state, ...nextState };
            }
            addEvent() {}
        }

        class PopupComponent {
            constructor() {
                this.id = "test-popup-id";
            }
            open() {}
        }

        return { Component, PopupComponent };
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
});
