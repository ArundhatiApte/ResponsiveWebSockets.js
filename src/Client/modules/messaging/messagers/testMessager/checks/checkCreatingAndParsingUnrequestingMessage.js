"use strict";

const expectEqual = require("assert").equal;
const typesOfIncomingMessages = require(
  "./../../../../../../common/ResponsiveWebSocketConnection/modules/messaging/typesOfIncomingMessages"
);

const checkCreatingAndParsingUnrequestingMessage = function(
  createUnrequestingMessage,
  message,
  startIndexOfBody,
  extractTypeOfIncomingMessage,
  extractMessageFromMessageWithHeader
) {
  const messageWithHeader = createUnrequestingMessage(message);
  const type = extractTypeOfIncomingMessage(messageWithHeader);
  expectEqual(type, typesOfIncomingMessages.unrequestingMessage);

  const body = extractMessageFromMessageWithHeader(messageWithHeader, startIndexOfBody);
  expectEqual(message, body);
};

module.exports = checkCreatingAndParsingUnrequestingMessage;
