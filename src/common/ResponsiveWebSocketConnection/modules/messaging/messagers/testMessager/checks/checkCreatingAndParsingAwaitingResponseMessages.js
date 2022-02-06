"use strict";

const typesOfIncomingMessages = require("./../../typesOfIncomingMessages"),
      createFnToCheckCreatingMessages = require("./_createFnToCheckCreatingMessages"),
      createFnToCheckCreatingMessageWithId = require("./_createFnToCheckCreatingMessageWithId");

const checkCreatingAndParsingAwaitingResponseMessage = createFnToCheckCreatingMessageWithId(
  244, typesOfIncomingMessages.incomingAwaitingResponse
);

const checkCreatingAndParsingAwaitingResponseMessages =
  createFnToCheckCreatingMessages(checkCreatingAndParsingAwaitingResponseMessage);

module.exports = checkCreatingAndParsingAwaitingResponseMessages;
