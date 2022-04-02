"use strict";

const typesOfIncomingMessages = require("./../../../../../../common/messaging/typesOfIncomingMessages"),
      createFnToCheckCreatingMessages = require("./_createFnToCheckCreatingMessages"),
      createFnToCheckCreatingMessageWithId = require("./_createFnToCheckCreatingMessageWithId");

const checkCreatingAndParsingAwaitingResponseMessage = createFnToCheckCreatingMessageWithId(
  244, typesOfIncomingMessages.request
);

const checkCreatingAndParsingAwaitingResponseMessages =
  createFnToCheckCreatingMessages(checkCreatingAndParsingAwaitingResponseMessage);

module.exports = checkCreatingAndParsingAwaitingResponseMessages;
