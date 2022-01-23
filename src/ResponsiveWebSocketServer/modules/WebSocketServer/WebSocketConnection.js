"use strict";

const _connection = "_",
      _onBinaryMessage = "_b",
      _onTextMessage = "_t";

const WebSocketConnection = class {
  constructor(uWSConnectionToClient) {
    this[_onBinaryMessage] = this[_onTextMessage] = null;
    this.onClose = null;
    this[_connection] = uWSConnectionToClient;
  }

  get url() {
    return this[_connection].url;
  }
  
  getRemoteAddress() {
    return this[_connection].getRemoteAddress();
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
  
  _emitOnClose(code, reason) {
    if (this.onClose) {
      if ((!reason) || reason.byteLength === 0) {
        this.onClose({code});   
      } else {
        reason = textDecoder.decode(reason);
        this.onClose({code, reason});
      }
    }
  }
  
  _emitOnBinaryMessage(bytes) {
    return this[_onBinaryMessage](bytes);
  }

  _emitOnTextMessage(bytes) {
    return this[_onTextMessage](textDecoder.decode(bytes));
  }
  
  sendBinaryMessage(bytesArrayBuffer) {
    return this[_connection].send(bytesArrayBuffer, true);
  }

  sendTextMessage(text) {
    return this[_connection].send(text);
  }
  
  close(code, reason) {
    return this[_connection].end(code, reason);
  }

  terminate() {
    return this[_connection].close();
  }
};

const textDecoder = new TextDecoder("utf8");

module.exports = WebSocketConnection;
