"use strict";

const WebSocketClientFromWS = require("ws").WebSocket;

const _onMessage = Symbol("_onMessage");

const W3CWebSocketClient = class extends WebSocketClientFromWS {
  constructor(url) {
    super(url);
    this.binaryType = "arraybuffer";
  }

  set onmessage(listener) {
    const prevListener = this[_onMessage];
    if (prevListener) {
      this.removeEventListener("message", prevListener);
    }
    const wrapedListener = createWrappedListenerOfMessageEvent(listener);
    this.addEventListener("message", wrapedListener);
    this[_onMessage] = wrapedListener;
  }

  get onmessage() {
    return this[_onMessage];
  }
};

const createWrappedListenerOfMessageEvent= function(originalListener) {
  return function(event) {
    let {data} = event;
    if (typeof data !== "string" ) {
      if (!(data instanceof ArrayBuffer)) {
        data = bufferAsArrayBuffer(data);
      }
    }
    originalListener({data});
  };
};

const bufferAsArrayBuffer = function(nodejsBuffer) {
  return nodejsBuffer.buffer;
};

module.exports = W3CWebSocketClient;
