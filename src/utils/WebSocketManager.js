import { authToken } from "../api/api.config";
import { fixIncompleteJSON } from "../Pages/map/components/trafficLightMarkers/utils";

class WebSocketManager {
  constructor() {
    this.connections = new Map();
    this.subscriptions = new Map();
  }

  _createSocketUrl(baseUrl, svetoforId) {
    return `${baseUrl}?svetofor_id=${svetoforId}&token=${authToken}`;
  }

  _getBaseUrl(vendor) {
    return Number(vendor) === 1
      ? import.meta.env.VITE_TRAFFICLIGHT_SOCKET
      : import.meta.env.VITE_TRAFFICLIGHT_SOCKET.replace(
          "/websocket/",
          "/websocketfama/"
        );
  }

  connect(svetoforId, vendor, onMessageCallback) {
    const baseUrl = this._getBaseUrl(vendor);
    const socketUrl = this._createSocketUrl(baseUrl, svetoforId);

    // Check if connection already exists
    if (this.connections.has(socketUrl)) {
      const existingConnection = this.connections.get(socketUrl);
      
      // Add new subscription
      if (!this.subscriptions.has(socketUrl)) {
        this.subscriptions.set(socketUrl, new Set());
      }
      this.subscriptions.get(socketUrl).add(onMessageCallback);

      return existingConnection;
    }

    // Create new WebSocket connection
    const socket = new WebSocket(socketUrl);

    socket.onopen = () => {
      console.log(`WebSocket connected for svetofor_id: ${svetoforId}`);
    };

    socket.onclose = () => {
      console.log(`WebSocket closed for svetofor_id: ${svetoforId}`);
      this.connections.delete(socketUrl);
      this.subscriptions.delete(socketUrl);
    };

    socket.onmessage = (event) => {
      let message = event.data;
      message = fixIncompleteJSON(message);
      
      try {
        const data = JSON.parse(message);
        
        // Notify all subscribed callbacks
        if (this.subscriptions.has(socketUrl)) {
          this.subscriptions.get(socketUrl).forEach(callback => {
            callback(data);
          });
        }
      } catch (error) {
        console.error(
          "Error parsing traffic light WebSocket message:",
          error
        );
      }
    };

    // Store the connection and its first subscription
    this.connections.set(socketUrl, socket);
    const subscriptionSet = new Set();
    subscriptionSet.add(onMessageCallback);
    this.subscriptions.set(socketUrl, subscriptionSet);

    return socket;
  }

  disconnect(svetoforId, vendor, callback) {
    const baseUrl = this._getBaseUrl(vendor);
    const socketUrl = this._createSocketUrl(baseUrl, svetoforId);

    // Remove specific callback from subscriptions
    if (this.subscriptions.has(socketUrl)) {
      const subscriptions = this.subscriptions.get(socketUrl);
      subscriptions.delete(callback);

      // If no more subscriptions, close the connection
      if (subscriptions.size === 0) {
        const socket = this.connections.get(socketUrl);
        if (socket) {
          socket.close();
          this.connections.delete(socketUrl);
          this.subscriptions.delete(socketUrl);
        }
      }
    }
  }
}

export default new WebSocketManager();
