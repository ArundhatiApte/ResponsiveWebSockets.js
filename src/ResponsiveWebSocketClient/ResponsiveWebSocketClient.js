"use strict";

const WebSocketClient = require("./modules/WebSocketClient"),
      ResponsiveWebSoket = require("./../common/ResponsiveWebSocketConnection/ResponsiveWebSocketConnection");
      
const {_connection} = ResponsiveWebSoket._namesOfPrivateProperties;

const ResponsiveWebSocketClient = class extends ResponsiveWebSoket {
  constructor(webSocketClient) {
    super(webSocketClient || new WebSocketClient());
    this._setupOnLoadListener();
  }

  setLoadListener(listener) {
    this[_onLoad] = listener;
  }
    
  _setupOnLoadListener() {
    this[_connection].onLoad = () => {
      this[_connection].onLoad = null;
      if (this[_onLoad]) {
        this[_onLoad]();
      }
    };
  }
  
  connect(url) {
    return this[_connection].connect(url);
  }
  
  close(code, reason) {
    return this[_connection].close(code, reason);
  }

  terminate() {
    return this[_connection].terminate();
  }
};

const _onLoad = "_77";

ResponsiveWebSocketClient.setWebSocketClientClass = WebSocketClient.setWebSocketClientClass;

module.exports = ResponsiveWebSocketClient;
