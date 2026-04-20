import { jest } from '@jest/globals';
import { FunctionalComponent, createComponent, component } from '../src/functionalComponent.js';

class FakeHTMLElement {}

describe('FunctionalComponent', () => {
    beforeEach(() => {
        global.HTMLElement = FakeHTMLElement;
        global.document = {
            querySelector: jest.fn(() => null)
        };
    });

    afterEach(() => {
        delete global.HTMLElement;
        delete global.document;
    });

    test('useState preserves state between renders', () => {
        const component = new FunctionalComponent(null, ({ useState, useMethods }) => {
            const [count, setCount] = useState(0);

            useMethods({
                increment() {
                    setCount((value) => value + 1);
                }
            });

            return `<div>${count}</div>`;
        });

        expect(component.render()).toBe('<div>0</div>');

        component.increment();

        expect(component.render()).toBe('<div>1</div>');
    });

    test('useEvents delegates to addEvent during addEvents lifecycle', () => {
        const component = new FunctionalComponent(null, ({ useEvents }) => {
            useEvents(({ addEvent }) => {
                addEvent('body', '.demo-btn', 'click', () => {});
            });

            return '<button class="demo-btn">Run</button>';
        });

        component.addEvent = jest.fn();
        component.render();
        component.addEvents();

        expect(component.addEvent).toHaveBeenCalledWith('body', '.demo-btn', 'click', expect.any(Function));
    });

    test('createComponent auto-renders when container exists', () => {
        const el = {
            innerHTML: '',
            querySelectorAll: jest.fn(() => []),
            querySelector: jest.fn(() => null)
        };

        global.document.querySelector.mockReturnValue(el);

        const component = createComponent('#app', () => '<div>Hello</div>');

        expect(component).toBeInstanceOf(FunctionalComponent);
        expect(el.innerHTML).toBe('<div>Hello</div>');
    });

    test('component is an alias for createComponent', () => {
        const el = {
            innerHTML: '',
            querySelectorAll: jest.fn(() => []),
            querySelector: jest.fn(() => null)
        };

        global.document.querySelector.mockReturnValue(el);

        const instance = component('#app', () => '<div>Alias</div>');

        expect(instance).toBeInstanceOf(FunctionalComponent);
        expect(el.innerHTML).toBe('<div>Alias</div>');
    });
});
