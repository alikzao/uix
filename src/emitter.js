export class Emitter {
    constructor() {
        if (!Emitter.instance) {
            this.listeners = {};
            Emitter.instance = this;
        }
        return Emitter.instance;
    }

    on(event, listener) {
        this.listeners[event] = this.listeners[event] || [];
        this.listeners[event].push(listener);
    }

    off(event, listener) {
        if (this.listeners[event]) {
            const index = this.listeners[event].indexOf(listener);
            if (index > -1) {
                this.listeners[event].splice(index, 1);
            }
        }
    }

    emit(event, ...args) {
        if(event === "roomsSummary") { return; }
        if (!this.listeners[event]) {
            return;
        }
        this.listeners[event].forEach(listener => listener(...args));
    }
}

const instance = new Emitter();
Object.freeze(instance);
export default instance;
