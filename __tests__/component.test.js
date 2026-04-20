import { jest } from '@jest/globals';
import { Component } from '../src/component.js';

class FakeHTMLElement {}

describe('Component', () => {
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

    test('initializes delegated event storage in the base constructor', () => {
        const component = new Component(null);

        expect(component.currentEventHandlers).toEqual([]);
    });

    test('supports selector lookup through document.querySelector', () => {
        const el = {
            querySelectorAll: jest.fn(() => [])
        };
        global.document.querySelector.mockReturnValue(el);

        const component = new Component('#app');

        expect(global.document.querySelector).toHaveBeenCalledWith('#app');
        expect(component.el).toBe(el);
    });

    test('useReducer dispatch uses the latest reducer state', () => {
        const component = new Component(null);
        const reducer = (state, action) => {
            if (action.type === 'inc') {
                return state + 1;
            }
            return state;
        };

        const [, dispatch] = component.useReducer(reducer, 0);

        dispatch({ type: 'inc' });
        dispatch({ type: 'inc' });

        expect(component._reducers[0].state).toBe(2);
    });

    test('renderComponent safely exits when component is detached', () => {
        const component = new Component(null);

        expect(() => component.renderComponent()).not.toThrow();
    });
});
