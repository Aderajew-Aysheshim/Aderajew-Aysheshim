
if (typeof window !== 'undefined') {
  const OriginalWebSocket = window.WebSocket;
  
  window.WebSocket = function(url, protocols) {
    if (url && url.includes('localhost:3000/ws')) {
      console.log('WebSocket connection to localhost:3000/ws prevented during development');
      return {
        close: () => {},
        send: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        readyState: 3 // CLOSED
      };
    }
    // Allow other WebSocket connections
    return new OriginalWebSocket(url, protocols);
  };
  // Copy static properties
  window.WebSocket.prototype = OriginalWebSocket.prototype;
  window.WebSocket.CONNECTING = OriginalWebSocket.CONNECTING;
  window.WebSocket.OPEN = OriginalWebSocket.OPEN;
  window.WebSocket.CLOSING = OriginalWebSocket.CLOSING;
  window.WebSocket.CLOSED = OriginalWebSocket.CLOSED;
}

export default window.WebSocket;
