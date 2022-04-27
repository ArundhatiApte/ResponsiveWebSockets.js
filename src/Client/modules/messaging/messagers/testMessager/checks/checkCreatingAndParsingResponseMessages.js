"use strict";

const typesOfIncomingMessages = require(
  "./../../../../../../common/ResponsiveWebSocketConnection/modules/messaging/typesOfIncomingMessages"
);
const createFnToCheckCreatingMessagesWithId = require("./_createFnToCheckCreatingMessagesWithId");

const checkCreatingAndParsingResponseMessages = createFnToCheckCreatingMessagesWithId(
  typesOfIncomingMessages.response
);

module.exports = checkCreatingAndParsingResponseMessages;
