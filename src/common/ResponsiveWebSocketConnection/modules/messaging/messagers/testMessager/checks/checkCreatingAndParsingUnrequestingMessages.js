"use strict";

const expectEqual = require("assert").equal,
      typesOfIncomingMessages = require("./../../typesOfIncomingMessages"),
      createFnToCheckCreatingMessages = require("./_createFnToCheckCreatingMessages");

const checkCreatingAndParsingUnrequestingMessage = function(
  message, createnUnResponsedMessage,
   parseMessage, extractMessageFromMessageWithHeader
) {
  const messageWithHeader = createnUnResponsedMessage(message);
  const {
    type, startIndex
  } = parseMessage(messageWithHeader);
  expectEqual(type, typesOfIncomingMessages.incomingWithoutWaitingResponse);

  const body = extractMessageFromMessageWithHeader(messageWithHeader, startIndex);
  expectEqual(message, body);
};

const checkCreatingAndParsingUnrequestingMessages =
  createFnToCheckCreatingMessages(checkCreatingAndParsingUnrequestingMessage);

module.exports = checkCreatingAndParsingUnrequestingMessages;
