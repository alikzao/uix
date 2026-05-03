/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Component: () => (/* reexport */ Component),
  Emitter: () => (/* reexport */ Emitter),
  ExtendedComponent: () => (/* reexport */ ExtendedComponent),
  FunctionalComponent: () => (/* reexport */ FunctionalComponent),
  PopupComponent: () => (/* reexport */ PopupComponent),
  TreeManager: () => (/* reexport */ TreeManager),
  component: () => (/* reexport */ component),
  createComponent: () => (/* reexport */ createComponent),
  emitter: () => (/* reexport */ emitter),
  socketService: () => (/* reexport */ socketService)
});

;// ./src/component.js
class Component {

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

;// ./src/functionalComponent.js


class FunctionalComponent extends Component {

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

function createComponent(selectorOrElement, setup, props = {}, options = {}) {
    const component = new FunctionalComponent(selectorOrElement, setup, props);

    if (options.autoRender !== false && component.el) {
        component.renderComponent();
    }

    return component;
}

function component(selectorOrElement, setup, props = {}, options = {}) {
    return createComponent(selectorOrElement, setup, props, options);
}

;// ./src/treeManager.js
class TreeManager  {

    constructor(getState) {
        this.getState = getState;
    }

    makeTree(items) {
        items.forEach(item => item.childrens = []);
        const rootItems = [];
        items.forEach(item => {
            if (item.doc.parentId) {
                const parent = items.find(parentItem => parentItem._id === item.doc.parentId);
                if (parent) {
                    parent.childrens.push(item);
                }
            } else {
                rootItems.push(item);
            }
        });
        return items.filter(item => !item.doc.parentId);
    }

    removeNode(docId) {
        function recursiveRemove(docs, docId) {
            for (let i = 0; i < docs.length; i++) {
                if (docs[i]._id === docId) {
                    docs.splice(i, 1);
                    return true;
                }
                if (docs[i].childrens && docs[i].childrens.length > 0) {
                    if (recursiveRemove(docs[i].childrens, docId)) {
                        return true;
                    }
                }
            }
            return false;
        }
        const state = this.getState();
        recursiveRemove(state.items, docId);
        return state.items;
    }

    addNode(newDoc) {
        // Recursively find a parent and insert the node in-place.
        function recursiveInsert(docs, newDoc) {
            for (let doc of docs) {
                if (doc._id === newDoc.doc.parentId) {
                    doc.childrens.push(newDoc);
                    return true;
                }
                if (doc.childrens && doc.childrens.length > 0) {
                    if (recursiveInsert(doc.childrens, newDoc)) {
                        return true;
                    }
                }
            }
            return false;
        }
        const state = this.getState();
        const inserted = recursiveInsert(state.items, newDoc);
        if (!inserted) {
            newDoc.doc.parentId = '-';
            state.items.push(newDoc);
        }
        return state.items;
    }

    updateNode(docId, options) {
        const state = this.getState();
        const recursiveUpdate = (nodes) => {
            for (let node of nodes) {
                if (node._id === docId) {
                    Object.assign(node.doc, options);
                    return true;
                }
                if (node.childrens && node.childrens.length > 0) {
                    if (recursiveUpdate(node.childrens)) {
                        return true;
                    }
                }
            }
            return false;
        };
        recursiveUpdate(state.items);
    }

    findById(items, id) {
        return items.find(doc => doc._id === id);
    }
}

;// ./src/emitter.js
class Emitter {
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
/* harmony default export */ const emitter = (instance);

;// ./src/socketService.js
class SocketService {

    constructor() {
        if (!SocketService.instance) {
            this.socket = null;
            SocketService.instance = this;
        }
        return SocketService.instance;
    }

    initialize({ userId }) {
        if (!this.socket) {
            const options = {
                query: { userId },
                reconnection: true,
                reconnectionAttempts: Infinity,
                reconnectionDelay: 600
            };
            const { isDev } = window.config;
            options.path = "/socket.io";
            options.transports = ["websocket", "polling"];
            this.socket = io(window.location.origin, options);
        }
    }

    getSocket() {
        if (!this.socket) {
            throw new Error('SocketService not initialized. Вызовите initialize() перед использованием.');
        }
        return this.socket;
    }

    on(event, callback) {
        this.getSocket().on(event, callback);
    }

    off(event, callback) {
        this.getSocket().off(event, callback);
    }

    emit(event, data) {
        this.getSocket().emit(event, data);
    }
}

const socketService_instance = new SocketService();
/* harmony default export */ const socketService = (socketService_instance);

;// ./src/extendedComponent.js





class ExtendedComponent extends Component {

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
        // removed by dead control flow

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

;// ./src/popupComponent.js



class PopupComponent extends ExtendedComponent {
    constructor(selector, props, id) {
        super(selector, props);
        this.size = props.size ? props.size : null;
        this.BToMPage = props.BToMPage ? true : false;
        this.id = id || Math.random().toString(36).substr(2, 9);
        this.popupElement = null; 
        this.onCloseRequest = props.onCloseRequest != undefined ? props.onCloseRequest : true;
    }

    withData(procId, docId) {
        this.procId = procId;
        this.docId = docId;
    }

    content() {
       return ``;
    }

    show(isAttach= true) {
        if (!this.popupElement) {
            const markup = this.render();
            document.body.insertAdjacentHTML('beforeend', markup);
            this.popupElement = document.getElementById(`popup-${this.id}`);
            if(isAttach){
                this.attachEvents();
            }
        }
        this.popupOverlay = this.popupElement.querySelector(`#popup-overlay-${this.id}`);
        this.popupContent = this.popupElement.querySelector(`#popup-content-${this.id}`);
        if (this.popupElement && this.popupOverlay && this.popupContent) {
            this.popupElement.style.display = 'flex';
            this.popupElement.style.animation = 'slideInFromLeft 0.4s ease-out forwards';
            this.popupOverlay.style.display = 'flex';
            this.popupContent.style.display = 'flex';
        } else {
            console.error('Popup elements not found');
        }
    }

    async hide(isRemove) {
        if (this.popupElement) {
            this.popupElement.style.animation = 'slideOutToLeft 0.3s ease-in forwards';
            if(this.onCloseRequest && isRemove){
                await req('/table/remove', {procId:this.procId, docId:this.docId});
            }
            await new Promise((resolve) => {
                const handleAnimationEnd = () => {
                    if(this.popupElement){
                        this.popupElement.removeEventListener('animationend', handleAnimationEnd);
                        document.body.removeChild(this.popupElement);
                        this.popupOverlay.style.display = 'none';
                        this.popupContent.style.display = 'none';
                    }
                    this.detachEvents();
                    this.popupElement = null;
                    this.popupOverlay = null;
                    this.popupContent = null;
                    resolve();
                };
                this.popupElement.addEventListener('animationend', handleAnimationEnd);
                setTimeout(handleAnimationEnd, 350);
            });
        }
    }

    async close(isRemove) {
        await this.hide(isRemove);
    }

    open() {
        this.show();
    }

    attachEvents() {
        this.popupOverlay = document.getElementById(`popup-overlay-${this.id}`);
        this.popupContent = document.getElementById(`popup-content-${this.id}`);
        // Delegate close actions to body so dynamic popup controls are handled consistently.
        this.addEvent('body',`#close-popup-${this.id}-1`, 'click', async () => await this.hide(true));
        this.addEvent('body',`#close-popup-${this.id}-2`, 'click', async () => await this.hide(true));
        this.addEvent('body',`#close-popup-${this.id}-3`, 'click', async () => await this.hide(true));
        this.addEvent('body',`#cancel-${this.id}`, 'click', async () => await this.hide(true));
    }

    leftCloseBtn() {
        // Left chevron close button for mobile layout.
        const html = this.isMobile && this.size !== 'small'
            ? `<span class="close-button2 angled-less-than" id="close-popup-${this.id}-2" style="color:white !important; font-weight:900; font-size:26px; font-family: 'Arial Black', sans-serif;">&#10216;</span>`
            : ``;
        return html;
    }

    rightCloseBtn() {
        // Standard close icon for desktop and compact popup size.
        const html = (this.size === 'small' || !this.isMobile)
            ? `<span class="close-button" id="close-popup-${this.id}-1">&times;</span>`
            : ``;
        return html;
    }

    bottomCloseBtn() {
        return this.size !== 'small' && this.BToMPage !== false
            ? `<button class="closePopup" id="close-popup-${this.id}-3" ><i class="bi bi-arrow-left"></i> Back to main page</button>`
            : ``;
    }

    bottomBarBtn() {
        return !this.isMobile
            ? `<div class="modal-footer" style="
                        display:flex;
                        justify-content:flex-end;
                        position:absolute;
                        bottom:0; right:20px;
                        width:100%;
                        padding:10px;">
          <div class="btn-group">
            <button type="button" id="cancel-${this.id}"
                    class="btn btn-secondary cancel"
                    style="background-color:#3a3a3a; color:#fff; border:1px solid #555; border-radius:6px; cursor:pointer; font-size:14px; padding:6px 12px; margin-right:10px;">
              Close
            </button>
            <button type="button" class="btn btn-primary save"
                    style="background-color:#007bff; color:#fff; border:none; border-radius:6px; cursor:pointer; font-size:14px; padding:6px 18px; min-width:120px;">
              Ok
            </button>
          </div>
       </div>`
            : ``;
    }

    getSmallStyle() {
        return this.size === 'small'
            ? `<style>
                    #close-popup-${this.id}-1 {
                        right: 10px;
                    }
                    .close-button:hover {
                        color: white;
                    }
                    #popup-content-${this.id} .popup-sub-content {
                        padding: 20px;
                        display: grid;
                        grid-template-columns: 20% 60% 20%;
                        width: 100%;
                        max-width: 500px;
                        margin: auto;  
                        box-sizing: border-box;                  
                    }
                    #popup-content-${this.id} input[type="text"],
                    #popup-content-${this.id} input[type="email"] {
                        grid-column: 1 / 4;
                        width: 100%; 
                        height: 40px; 
                        font-size: 16px; 
                        padding: 5px; 
                    }
                    #popup-content-${this.id} button {
                        padding: 8px;
                        margin-top: 20px; 
                        grid-column: 1 / 3;
                        width: 80%; 
                        background-color: blue;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    }
                    #popup-content-${this.id} label {
                        grid-column: 1 / 4;
                        margin-bottom: 5px;
                    }
                    #popup-content-${this.id} {
                        width:75%;
                        top: 30vh;
                        bottom: 40vw;
                        border-radius: 8px;
                    }
                    #close-popup-${this.id}-3{
                        width: 97% !important; 
                    }
                </style>` : ``;
    }

    detachEvents() {
        this.currentEventHandlers.forEach(handler => {
            const { element, eventType, method } = handler;
            element.removeEventListener(eventType, method);
        });
        this.currentEventHandlers = [];
    }

    render() {
        return `
            <style>
                .popup {
                    display: none; 
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000; 
                    
                    
                }
                input[type="text"] {
                    background-color: #222222;
                    color: #fff;
                }
                input[type="date"] {
                    background-color: #222222;
                    color: #fff;
                }
                select {
                    background-color: #222222;
                    color: #f6f5f5;
                }
                select option {
                    background-color: #222222;
                    color: #ffffff;
                }
                .popup-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5); 
                }
                
                input[type="datetime-local"].styled-input {
                  background-color: #222222;
                  color: #ffffff;
                  border: 1px solid #afaeae;
                  border-radius: 6px;
                  padding: 8px 10px;
                }
                
                
                input[type="datetime-local"].styled-input::-webkit-calendar-picker-indicator {
                  filter: invert(1);           
                  opacity: 0.8;
                  cursor: pointer;
                }
                
                
                input[type="datetime-local"].styled-input::-webkit-datetime-edit,
                input[type="datetime-local"].styled-input::-webkit-datetime-edit-fields-wrapper,
                input[type="datetime-local"].styled-input::-webkit-datetime-edit-text,
                input[type="datetime-local"].styled-input::-webkit-datetime-edit-hour-field,
                input[type="datetime-local"].styled-input::-webkit-datetime-edit-minute-field,
                input[type="datetime-local"].styled-input::-webkit-datetime-edit-day-field,
                input[type="datetime-local"].styled-input::-webkit-datetime-edit-month-field,
                input[type="datetime-local"].styled-input::-webkit-datetime-edit-year-field {
                  color: #ffffff;
                }
                
                
                input[type="datetime-local"].styled-input:focus {
                  outline: none;
                  border-color: #6b6bff;
                  box-shadow: 0 0 0 3px rgba(107,107,255,0.2);
                }
                
                
                input[type="datetime-local"].styled-input {
                  color-scheme: dark;
                }
                textarea.styled-input.form-control {
                  background-color: #222222;
                  color: #ffffff;
                  border: 1px solid #eeeeee;  
                  border-radius: 6px;
                  padding: 8px 10px;
                  min-height: 90px;
                  resize: vertical;           
                  color-scheme: dark;         
                }
                textarea.styled-input.form-control::placeholder {
                  color: #cfcfcf;
                }
                textarea.styled-input.form-control:focus {
                  outline: none;
                  border-color: #ffffff;
                  box-shadow: 0 0 0 3px rgba(255,255,255,0.15);
                }

                .popup-content {
                    position: relative;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 5px;
                    z-index: 1001; 
                    color: white;
                }

            </style>
            ${this.getSmallStyle()}
            <div id="popup-${this.id}" class="popup" >
                <div class="popup-overlay" id="popup-overlay-${this.id}"></div>
                <div class="popup-content" id="popup-content-${this.id}">
                    ${this.rightCloseBtn()}
                    ${this.leftCloseBtn()}
                    ${this.content()}
                    ${this.bottomCloseBtn()}
                    ${this.bottomBarBtn()}
                </div>
               
            </div>`;
    }
}



;// ./src/index.js









;// ./src/plugin-entry.js


window.UIXComponents = __webpack_exports__;
/******/ })()
;