"use strict";

const WebSocketServer = require("./modules/WebSocketServer/WebSocketServerBasedOnUWS"),
      ResponsiveConnection = require("./modules/ResponsiveConnectionToWebSocketClient");
      
const ResponsiveWebSocketServer = class {
  constructor(options) {
    this[_server] = new WebSocketServer(options);
  }
  
  listen(port) {
    return this[_server].listen(port);
  }

  setConnectionListener(listener) {
    if (listener) {
      this[_server].onConnectionCreated = (nonResponsiveConnectionToClient) => {
        const responsiveConnection = new ResponsiveConnection(nonResponsiveConnectionToClient);
        listener.call(this, responsiveConnection);
      };
    } else {
      delete this[_server].onConnectionCreated;
    }
  }
  
  close() {
    return this[_server].close();
  }
};

const _server = "_",
      _onConnection = "_1",
      _onUpgrade = "_2";

module.exports = ResponsiveWebSocketServer;
