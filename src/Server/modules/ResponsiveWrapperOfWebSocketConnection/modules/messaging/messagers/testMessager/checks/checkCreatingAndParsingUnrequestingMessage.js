"use strict";

const expectEqual = require("assert").strictEqual;

const typesOfIncomingMessages = require(
  "./../../../../../../../../common/ResponsiveWebSocketConnection/modules/messaging/typesOfIncomingMessages"
);

const checkCreatingAndParsingUnrequestingMessage = function(
  headerOfUnrequestingMessage,
  extractTypeOfIncomingMessage
) {
  const type = extractTypeOfIncomingMessage(headerOfUnrequestingMessage);
  expectEqual(type, typesOfIncomingMessages.unrequestingMessage);
};

module.exports = checkCreatingAndParsingUnrequestingMessage;
