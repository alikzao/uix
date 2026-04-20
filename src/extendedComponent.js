import { TreeManager } from "./treeManager.js";
import emitter from './emitter.js';
import socketService from './socketService.js';
import { Component } from './component.js';

export class ExtendedComponent extends Component {

    static isSocketEventsRegistered = false;

    constructor(selector, props) {
        super(selector, props);
        this.popups = {};
        this.currentEventHandlers = [];
        this.socketEventHandlers = {};
        this.eventEmitter = emitter;
        this.tree = new TreeManager(() => this.state);
        this.updResizeInfo();
        if (!ExtendedComponent.isSocketEventsRegistered) {
            this.registerSocketEvents();
            ExtendedComponent.isSocketEventsRegistered = true;
        }
    }

    registerSocketEvents() {
        const socket = socketService.getSocket();
        if (typeof socket.onAny === 'function') {
            socket.onAny((eventName, ...args) => {
                this.eventEmitter.emit(eventName, ...args);
            });
        }
    }

    addSocketEvent(event, handler) {
        this.eventEmitter.on(event, handler);
    }

    removeSocketEvent(event, handler) {
        this.eventEmitter.off(event, handler);
    }

    emitSocketEvent(event, data) {
        socketService.emit(event, data);
        this.eventEmitter.emit(event, data);
        console.log(`Emitted event: "${event}" with data:`, data);
    }

    updResizeInfo() {
        this.isMobile = window.innerWidth <= 767;
    }

    getDocId(el, name = null) {
        if (name !== null) {
            const closestParent = el ? el.closest(name) : null;
            return closestParent.getAttribute('data-id');
        } else {
            return el.getAttribute('data-id');
        }
        return null;
    }

    dispose() {
        for (const event in this.socketEventHandlers) {
            this.props.socket.off(event, this.socketEventHandlers[event]);
        }
        this.socketEventHandlers = {};
    }

    debug(){
        const proto = Object.getPrototypeOf(this);
        const methodSource = proto.render.toString();
        const className = proto.constructor.name;

        console.log(`🔍 render() вызван из класса: ${className}`);
        console.log("📜 Код метода render():\n", methodSource);
        console.trace();
    }
}
