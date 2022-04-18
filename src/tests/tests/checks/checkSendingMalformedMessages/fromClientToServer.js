"use strict";

const createFnToCheckSendingMalformedMessages = require("./utils/createFnToCheckSendingMalformedMessages");

const sendMessageByWebSocket = (webSocket, message) => webSocket.send(message);

const checkSendingMalformedBinaryMessagesFromClientToServer = createFnToCheckSendingMalformedMessages(
  require("./utils/brokenBinaryMessages"),
  "setMalformedBinaryMessageListener",
  sendMessageByWebSocket
);

const checkSendingMalformedTextMessagesFromClientToServer = createFnToCheckSendingMalformedMessages(
  require("./utils/brokenTextMessages"),
  "setMalformedTextMessageListener",
  sendMessageByWebSocket
);

module.exports = {
  checkSendingMalformedBinaryMessagesFromClientToServer,
  checkSendingMalformedTextMessagesFromClientToServer
};
