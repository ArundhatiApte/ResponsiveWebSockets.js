"use strict";

const {
  checkSendingMalformedBinaryMessagesByServerToClient,
  checkSendingTextMessagesByServerToClient
} = require("./fromServerToClient");

const {
  checkSendingMalformedBinaryMessagesByClientToServer,
  checkSendingTextMessagesByClientToServer
} = require("./fromClientToServer");

module.exports = {
  checkSendingMalformedBinaryMessagesByServerToClient,
  checkSendingTextMessagesByServerToClient,

  checkSendingMalformedBinaryMessagesByClientToServer,
  checkSendingTextMessagesByClientToServer
};
