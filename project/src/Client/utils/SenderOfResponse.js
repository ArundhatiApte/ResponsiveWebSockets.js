"use strict";

const {
  fillHeaderAsResponse: fillHeaderAsBinaryResponse
} = require("./../../common/ResponsiveWebSocketConnection/modules/messaging/binaryMessages/binaryMessager");

const SenderOfResponse = class {
  constructor(nonResponsiveWebSocketConnection, idOfMessage) {
    this[_webSocketConnection] = nonResponsiveWebSocketConnection;
    this[_idOfMessage] = idOfMessage;
  }

  sendBinaryResponse(messageInArrayBuffer) {
    fillHeaderAsBinaryResponse(this[_idOfMessage], messageInArrayBuffer);
    this[_webSocketConnection].send(messageInArrayBuffer);
  }
};

const _webSocketConnection = "_",
      _idOfMessage = "_i";

module.exports = SenderOfResponse;
