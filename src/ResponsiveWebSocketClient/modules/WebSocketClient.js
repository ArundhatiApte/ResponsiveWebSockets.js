"use strict";

let W3CWebSocketClientClass;

const WebSocketClient = class {
  constructor() {
    this.onLoad = this.onError = this.onClose = null;
    this[_onBinaryMessage] = this[_onTextMessage] = null;
  }

  set onBinaryMessage(listener) {
    this[_onBinaryMessage] = listener;
  }

  get onBinaryMessage() {
    return this[_onBinaryMessage];
  }

  set onTextMessage(listener) {
    this[_onTextMessage] = listener;
  }

  get onTextMessage() {
    return this[_onTextMessage];
  }
  
  connect(url) {
    return new Promise((resolve, reject) => {
      const client = this[_webSocketClient] = new W3CWebSocketClientClass(url);      
      client.binaryType = "arrayBuffer";
      
      const self = this;
      client.onopen = function onWebSocketLoad() {
        self._setupListenersOfEvents();
        self._emitOnLoad();
        resolve();
      };
      client.onerror = function onWebSocketFail(error) {
        self._emitOnError(error);
        reject(error);
      };
    });
  }
  
  _setupListenersOfEvents() {
    const webSocket = this[_webSocketClient];
    webSocket.onmessage = _emitOnFirstMessage.bind(this);
    webSocket.onclose = this._emitOnClose.bind(this);
    webSocket.onerror = this._emitOnError.bind(this);
  }
  
  close(reason, code) {
    return this[_webSocketClient].close(reason, code);
  }
};

const _webSocketClient = "_",
      _onBinaryMessage = "_2",
      _onTextMessage = "_3",
      _onError = "_4",
      Proto = WebSocketClient.prototype;

Proto.sendBinaryMessage = Proto.sendTextMessage = function sendMessage(message) {
  return this[_webSocketClient].send(message);
};

const _emitOnFirstMessage = (function() {
  
  const _emitOnMessageWithArrayBuffer = function(event) {
    const {data} = event;
    if (typeof data === "string") {
      this[_onTextMessage](data);
      return;
    }
    this[_onBinaryMessage](data);
  };
  
  const _emitOnMessageWithBlob = async function(event) {
    const {data} = event;
    if (typeof data === "string") {
      this[_onTextMessage](data);
      return;
    }
    const bytes = await data.arrayBuffer();
    this[_onBinaryMessage](bytes);
  };
  
  const _emitOnFirstMessage = async function(event) {
    let data = event.data;
    if (typeof data === "string") {
      this[_onTextMessage](data);
      return;
    }
    
    if (data instanceof ArrayBuffer) {
      this[_webSocketClient].onmessage = _emitOnMessageWithArrayBuffer.bind(this);
    } else {
      data = await data.arrayBuffer();
      this[_webSocketClient].onmessage = _emitOnMessageWithBlob.bind(this);
    }
    
    this[_onBinaryMessage](data);
  };
  
  return _emitOnFirstMessage;
})();
      
const _createMethodToEmitEvent = function(nameOfEventProperty) {
  return function() {
    const listener = this[nameOfEventProperty];
    if (listener) {
      listener.apply(this, arguments);
    }
  };
};

Proto._emitOnLoad = _createMethodToEmitEvent("onLoad");
Proto._emitOnError = _createMethodToEmitEvent("onError");
Proto._emitOnClose = _createMethodToEmitEvent("onCLose");
      
WebSocketClient.setWebSocketClientClass = function(WebSocketClient) {
  W3CWebSocketClientClass = WebSocketClient;
};

module.exports = WebSocketClient;
