"use strict";

const expectEqual = require("assert").equal,
      typesOfIncomingMessages = require("./../../typesOfIncomingMessages"),
      createFnToCheckCreatingMessages = require("./_createFnToCheckCreatingMessages");

const checkCreatingAndParsingUnrequestingMessage = function(
  startIndexOfBody,
  message,
  createUnResponsedMessage,
  parseMessage,
  extractMessageFromMessageWithHeader
) {
  const messageWithHeader = createUnResponsedMessage(message);
  const {type} = parseMessage(messageWithHeader);
  expectEqual(type, typesOfIncomingMessages.incomingWithoutWaitingResponse);

  const body = extractMessageFromMessageWithHeader(messageWithHeader, startIndexOfBody);
  expectEqual(message, body);
};

const checkCreatingAndParsingUnrequestingMessages =
  createFnToCheckCreatingMessages(checkCreatingAndParsingUnrequestingMessage);

module.exports = checkCreatingAndParsingUnrequestingMessages;
