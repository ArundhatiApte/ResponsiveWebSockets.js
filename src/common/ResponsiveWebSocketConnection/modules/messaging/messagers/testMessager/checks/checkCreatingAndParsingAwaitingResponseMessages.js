"use strict";

const typesOfIncomingMessages = require("./../../typesOfIncomingMessages"),
      createFnToCheckCreatingMessages = require("./_createFnToCheckCreatingMessages"),
      createFnToCheckCreatingMessageWithId = require("./_createFnToCheckCreatingMessageWithId");

const checkCreatingAndParsingAwaitingResponseMessagesMessage = createFnToCheckCreatingMessageWithId(
  244, typesOfIncomingMessages.incomingAwaitingResponse
);

const checkCreatingAndParsingAwaitingResponseMessages =
  createFnToCheckCreatingMessages(checkCreatingAndParsingAwaitingResponseMessagesMessage);

module.exports = checkCreatingAndParsingAwaitingResponseMessages;
