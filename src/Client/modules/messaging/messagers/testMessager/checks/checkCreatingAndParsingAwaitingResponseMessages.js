"use strict";

const typesOfIncomingMessages = require(
  "./../../../../../../common/ResponsiveWebSocketConnection/modules/messaging/typesOfIncomingMessages"
);
const createFnToCheckCreatingMessagesWithId = require("./_createFnToCheckCreatingMessagesWithId");

const checkCreatingAndParsingAwaitingResponseMessages = createFnToCheckCreatingMessagesWithId(
  typesOfIncomingMessages.request
);

module.exports = checkCreatingAndParsingAwaitingResponseMessages;
