"use strict";

const createFnToCheckCreatingMessages = function(checkCreatingAndParsingMessage) {
  return function(
    startIndexOfBody, messages, createMessage, parseMessage, extractMessageFromMessageWithHeader
  ) {
    return checkCreatingAndParsingMessages(
      checkCreatingAndParsingMessage,
      startIndexOfBody,
      messages,
      createMessage,
      parseMessage,
      extractMessageFromMessageWithHeader
    );
  };
};

const checkCreatingAndParsingMessages = function(
  checkCreatingAndParsingMessage,
  startIndexOfBody,
  messages,
  createMessage,
  parseMessage,
  extractMessageFromMessageWithHeader
) {
  for (const message of messages) {
    checkCreatingAndParsingMessage(
      startIndexOfBody,
      message,
      createMessage,
      parseMessage,
      extractMessageFromMessageWithHeader
    );
  }
};

module.exports = createFnToCheckCreatingMessages;
