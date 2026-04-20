import { jest } from '@jest/globals';
import emitter, { Emitter } from '../src/emitter.js';

describe('Emitter', () => {
    beforeEach(() => {
        Object.keys(emitter.listeners).forEach((event) => {
            delete emitter.listeners[event];
        });
    });

    test('default export is a singleton instance', () => {
        const another = new Emitter();

        expect(another).toBe(emitter);
    });

    test('emits events to subscribed listeners', () => {
        const listener = jest.fn();

        emitter.on('ping', listener);
        emitter.emit('ping', 1, 2);

        expect(listener).toHaveBeenCalledWith(1, 2);
    });

    test('off removes an existing listener', () => {
        const listener = jest.fn();

        emitter.on('ping', listener);
        emitter.off('ping', listener);
        emitter.emit('ping', 1);

        expect(listener).not.toHaveBeenCalled();
    });

    test('roomsSummary event is ignored by design', () => {
        const listener = jest.fn();

        emitter.on('roomsSummary', listener);
        emitter.emit('roomsSummary', { total: 1 });

        expect(listener).not.toHaveBeenCalled();
    });
});
