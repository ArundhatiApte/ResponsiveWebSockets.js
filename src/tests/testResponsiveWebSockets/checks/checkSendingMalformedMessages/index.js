"use strict";

const {
  checkSendingMalformedBinaryMessagesFromServerToClient,
  checkSendingMalformedTextMessagesFromServerToClient
} = require("./fromServerToClient");

const {
  checkSendingMalformedBinaryMessagesFromClientToServer,
  checkSendingMalformedTextMessagesFromClientToServer
} = require("./fromClientToServer");

module.exports = {
  checkSendingMalformedBinaryMessagesFromServerToClient,
  checkSendingMalformedTextMessagesFromServerToClient,
  checkSendingMalformedBinaryMessagesFromClientToServer,
  checkSendingMalformedTextMessagesFromClientToServer
};
