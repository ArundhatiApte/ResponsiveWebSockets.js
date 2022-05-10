"use strict";

const createFnToCheckSendingMalformedMessages = require("./utils/createFnToCheckSendingMalformedMessages");

const sendMessageByWebSocket = (webSocket, message) => webSocket.send(message);

const checkSendingMalformedBinaryMessagesByClientToServer = createFnToCheckSendingMalformedMessages(
  require("./utils/brokenBinaryMessages"),
  "setMalformedBinaryMessageListener",
  sendMessageByWebSocket
);

const checkSendingTextMessagesByClientToServer = createFnToCheckSendingMalformedMessages(
  ["abcd"],
  "setTextMessageListener",
  sendMessageByWebSocket
);

module.exports = {
  checkSendingMalformedBinaryMessagesByClientToServer,
  checkSendingTextMessagesByClientToServer
};
