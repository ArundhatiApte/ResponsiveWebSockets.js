"use strict";

const createFnToCheckSendingMalformedMessages = require("./utils/createFnToCheckSendingMalformedMessages");

const checkSendingMalformedBinaryMessagesFromServerToClient = createFnToCheckSendingMalformedMessages(
  require("./utils/brokenBinaryMessages"),
  "setMalformedBinaryMessageListener",
  function sendBinaryMessageByWebSocket(webSocket, message) {
    return webSocket.send(message, true);
  }
);

const checkSendingMalformedTextMessagesFromServerToClient = createFnToCheckSendingMalformedMessages(
  require("./utils/brokenTextMessages"),
  "setMalformedTextMessageListener",
  function sendTextMessageByWebSocket(webSocket, message) {
    return webSocket.send(message);
  }
);

module.exports = {
  checkSendingMalformedBinaryMessagesFromServerToClient,
  checkSendingMalformedTextMessagesFromServerToClient
};
