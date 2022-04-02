"use strict";

const expectEqual = require("assert").equal,
      typesOfIncomingMessages = require("./../../../../../../common/messaging/typesOfIncomingMessages"),
      createFnToCheckCreatingMessages = require("./_createFnToCheckCreatingMessages");

const checkCreatingAndParsingUnrequestingMessage = function(
  startIndexOfBody,
  message,
  createUnResponsedMessage,
  extractTypeOfIncomingMessage,
  extractIdOfMessage, // unused
  extractMessageFromMessageWithHeader
) {
  const messageWithHeader = createUnResponsedMessage(message);
  const type = extractTypeOfIncomingMessage(messageWithHeader);
  expectEqual(type, typesOfIncomingMessages.unrequestingMessage);

  const body = extractMessageFromMessageWithHeader(messageWithHeader, startIndexOfBody);
  expectEqual(message, body);
};

const checkCreatingAndParsingUnrequestingMessages =
  createFnToCheckCreatingMessages(checkCreatingAndParsingUnrequestingMessage);

module.exports = checkCreatingAndParsingUnrequestingMessages;
