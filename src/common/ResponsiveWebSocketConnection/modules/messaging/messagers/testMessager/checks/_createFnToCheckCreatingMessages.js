"use strict";

const createFnToCheckCreatingMessages = function(checkCreatingAndParsingMessage) {
  return function(
    startIndexOfBody,
    messages,
    createMessage,
    extractTypeOfIncomingMessage,
    extractIdOfMessage,
    extractMessageFromMessageWithHeader
  ) {
    return checkCreatingAndParsingMessages(
      checkCreatingAndParsingMessage,
      startIndexOfBody,
      messages,
      createMessage,
      extractTypeOfIncomingMessage,
      extractIdOfMessage,
      extractMessageFromMessageWithHeader
    );
  };
};

const checkCreatingAndParsingMessages = function(
  checkCreatingAndParsingMessage,
  startIndexOfBody,
  messages,
  createMessage,
  extractTypeOfIncomingMessage,
  extractIdOfMessage,
  extractMessageFromMessageWithHeader
) {
  for (const message of messages) {
    checkCreatingAndParsingMessage(
      startIndexOfBody,
      message,
      createMessage,
      extractTypeOfIncomingMessage,
      extractIdOfMessage,
      extractMessageFromMessageWithHeader
    );
  }
};

module.exports = createFnToCheckCreatingMessages;
