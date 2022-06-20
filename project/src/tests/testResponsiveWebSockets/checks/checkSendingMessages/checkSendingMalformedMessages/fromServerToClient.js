"use strict";

const createFnToCheckSendingMalformedMessages = require("./utils/createFnToCheckSendingMalformedMessages");

const checkSendingMalformedBinaryMessagesByServerToClient = createFnToCheckSendingMalformedMessages(
  require("./utils/malformedBinaryMessages"),
  "setMalformedBinaryMessageListener",
  function sendBinaryMessageByWebSocket(webSocket, message) {
    return webSocket.send(message, true);
  }
);

const checkSendingTextMessagesByServerToClient = createFnToCheckSendingMalformedMessages(
  ["efgh"],
  "setTextMessageListener",
  function sendTextMessageByWebSocket(webSocket, message) {
    return webSocket.send(message);
  }
);

module.exports = {
  checkSendingMalformedBinaryMessagesByServerToClient,
  checkSendingTextMessagesByServerToClient
};
