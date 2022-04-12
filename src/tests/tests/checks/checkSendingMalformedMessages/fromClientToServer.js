"use strict";

const createFnToCheckSendingMalformedMessages = require("./utils/createFnToCheckSendingMalformedMessages");

const sendMessageByWebSocket = function(webSocket, message) {
  return webSocket.send(message);
};

const checkSendingMalformedBinaryMessagesFromClientToServer = createFnToCheckSendingMalformedMessages(
  require("./utils/brokenBinaryMessages"),
  require("./utils/setMalformedBinaryMessageListener"),
  sendMessageByWebSocket
);

const checkSendingMalformedTextMessagesFromClientToServer = createFnToCheckSendingMalformedMessages(
  require("./utils/brokenTextMessages"),
  require("./utils/setMalformedTextMessageListener"),
  sendMessageByWebSocket
);

module.exports = {
  checkSendingMalformedBinaryMessagesFromClientToServer,
  checkSendingMalformedTextMessagesFromClientToServer
};
