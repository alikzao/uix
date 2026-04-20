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

const instance = new SocketService();
export default instance;
