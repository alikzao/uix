export class Emitter {
    constructor() {
        // this.listeners = {};
        if (!Emitter.instance) {
            this.listeners = {};
            Emitter.instance = this;
        }
        return Emitter.instance;
    }

    on(event, listener) {
        this.listeners[event] = this.listeners[event] || [];
        this.listeners[event].push(listener);
        // console.info(`Listener added for "${event}". Total listeners: ${this.listeners[event].length}`);
    }

    // Отписка от события
    off(event, listener) {
        if (this.listeners[event]) {
            const index = this.listeners[event].indexOf(listener);
            if (index > -1) {
                this.listeners[event].splice(index, 1);
                // console.log(`Listener removed for ${event}. Total listeners: ${this.listeners[event].length}`);
            }
        }
    }

    emit(event, ...args) {
        // console.log(`Emitting ${event} with args`, args);
        if(event === "roomsSummary") { return; }
        if (!this.listeners[event]) {
            // console.error(`No listeners for event: ${event}`);
            return;
        }
        // console.info(`Listener emitting for "${event}". Total listeners ${this.listeners[event].length}`);
        this.listeners[event].forEach(listener => listener(...args));
    }
}

const instance = new Emitter();
Object.freeze(instance);
export default instance;