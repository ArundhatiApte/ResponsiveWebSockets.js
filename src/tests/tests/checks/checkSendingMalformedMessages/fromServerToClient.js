"use strict";

const createFnToCheckSendingMalformedMessages = require("./utils/createFnToCheckSendingMalformedMessages");

const checkSendingMalformedBinaryMessagesFromServerToClient = createFnToCheckSendingMalformedMessages(
  require("./utils/brokenBinaryMessages"),
  require("./utils/setMalformedBinaryMessageListener"),
  function sendBinaryMessageByWebSocket(webSocket, message) {
    return webSocket.send(message, true);
  }
);

const checkSendingMalformedTextMessagesFromServerToClient = createFnToCheckSendingMalformedMessages(
  require("./utils/brokenTextMessages"),
  require("./utils/setMalformedTextMessageListener"),
  function sendTextMessageByWebSocket(webSocket, message) {
    return webSocket.send(message);
  }
);

module.exports = {
  checkSendingMalformedBinaryMessagesFromServerToClient,
  checkSendingMalformedTextMessagesFromServerToClient
};
