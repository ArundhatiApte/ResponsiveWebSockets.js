"use strict";

const typesOfIncomingMessages = require("./../../../../../../common/messaging/typesOfIncomingMessages"),
      createFnToCheckCreatingMessages = require("./_createFnToCheckCreatingMessages"),
      createFnToCheckCreatingMessageWithId = require("./_createFnToCheckCreatingMessageWithId");

const checkCreatingAndParsingResponseMessage =
  createFnToCheckCreatingMessageWithId(42, typesOfIncomingMessages.response);

const checkCreatingAndParsingResponseMessages =
  createFnToCheckCreatingMessages(checkCreatingAndParsingResponseMessage);

module.exports = checkCreatingAndParsingResponseMessages;
