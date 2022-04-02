"use strict";

const {
  binaryMessager: {
    createHeaderOfResponse: createHeaderOfBinaryResponse
  },
  textMessager: {
    createHeaderOfResponse: createHeaderOfTextResponse
  }
} = require("./messaging/messaging");

const SenderOfResponse = class {
  constructor(webSocket, idOfMessage) {
    this[_connection] = webSocket;
    this[_idOfMessage] = idOfMessage;
  }

  sendBinaryResponse(message) {
    const connection = this[_connection];
    const messageIsBinary = true;
    const header = createHeaderOfBinaryResponse(this[_idOfMessage]);
    connection.sendFirstFragment(header, messageIsBinary);
    connection.sendLastFragment(message, messageIsBinary);
  }
  
  sendTextResponse(message) {
    const connection = this[_connection];
    connection.sendFirstFragment(createHeaderOfTextResponse(this[_idOfMessage]));
    connection.sendLastFragment(message);
  }
};

const _connection = "_",
      _idOfMessage = "_i";

module.exports = SenderOfResponse;
