export class Component {

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

    // initState(state) {
    //     this.state = this.createReactiveState(state);
    //     this.renderComponent();
    // }
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
            // Обрабатываем data-click (рекомендуемый способ)
            if (el.hasAttribute('data-click')) {
                const methodName = el.getAttribute('data-click');
                if (typeof this[methodName] === 'function') {
                    el.addEventListener('click', (event) => this[methodName](event));
                }
            }

            // Обрабатываем любые атрибуты onEvent
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

    /**
     * Регистрирует обработчик события с делегированием.
     *
     * @param {string} parentSelector - CSS-селектор родительского элемента, на котором устанавливается обработчик.
     * @param {string|HTMLElement} selectorOrElement - CSS-селектор или конкретный элемент для делегирования события.
     * @param {string} eventType - Тип события (например, 'click').
     * @param {Function} handler - Функция-обработчик события.
     */
    addEvent(parentSelector, selectorOrElement, eventType, handler) {
        const parentElement = document.querySelector(parentSelector);
        if (!parentElement) return;

        // Создаем обработчик с делегированием, который будет навешен на родителя.
        const delegatedHandler = (event) => {
            let currentElement = event.target;
            // Проходим по дереву от target до родительского элемента.
            while (currentElement && currentElement !== parentElement) {
                // Если selectorOrElement — строка, используем его как CSS-селектор.
                if (typeof selectorOrElement === 'string') {
                    if (currentElement.matches(selectorOrElement)) {
                        // Вызываем обработчик в контексте текущего объекта.
                        handler.call(this, event);
                        event.stopPropagation();
                        return;
                    }
                } else {
                    // Если передан сам элемент, сравниваем его с текущим.
                    if (currentElement === selectorOrElement) {
                        handler.call(this, event);
                        event.stopPropagation();
                        return;
                    }
                }
                // Переходим к родительскому элементу.
                currentElement = currentElement.parentNode;
            }
        };
        // Проверяем, не добавлялся ли уже обработчик с такими параметрами.
        const isAlreadyAdded = this.currentEventHandlers.some(registered =>
            registered.element === parentElement &&
            registered.eventType === eventType &&
            registered.selector === selectorOrElement
        );
        // Если такой обработчик еще не зарегистрирован, навешиваем его и сохраняем ссылку.
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

// this.state = { ...this.state, ...newState };

// bindEvents() {
//     const elements = this.el.querySelectorAll('[data-click]');
//     elements.forEach(el => {
//         const methodName = el.getAttribute('data-click');
//
//         // Проверяем, является ли содержимое полноценной JS-функцией
//         if (methodName.startsWith('(') || methodName.includes('=>')) {
//             try {
//                 const func = new Function(`return ${methodName}`)();
//                 if (typeof func === 'function') {
//                     el.addEventListener('click', func);
//                 }
//             } catch (error) {
//                 console.error(`Ошибка при обработке data-click: ${error.message}`);
//             }
//         } else if (typeof this[methodName] === 'function') {
//             el.addEventListener('click', (event) => this[methodName](event));
//         }
//     });
// }


// mount() {
//     const proto = Object.getPrototypeOf(this); // Определяем текущий класс
//     const methodSource = proto.render.toString(); // Получаем исходный код метода
//     const className = proto.constructor.name; // Получаем имя класса
//     console.log(`🔍 render() вызван из класса: ${className}`);
//     console.log("📜 Код метода render():\n", methodSource);
//     console.trace(); // Покажет стек вызовов
//     const rend = this.render();
//     if (rend === undefined) {
//         console.error("⚠️ render() вернул undefined!", this);
//         debugger; // Остановит выполнение
//     }
//     this.el.innerHTML = rend || "<!-- Ошибка: render() вернул undefined -->";
// }
