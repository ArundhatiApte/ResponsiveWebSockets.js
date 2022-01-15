"use strict";

const createFnToCheckCreatingMessages = function(checkCreatingAndParsingMessage) {
  return function(
    messages, createMessage, parseMessage, extractMessageFromMessageWithHeader
  ) {
    return checkCreatingAndParsingMessages(
      checkCreatingAndParsingMessage,
      messages, createMessage,
      parseMessage, extractMessageFromMessageWithHeader
    );
  };
};

const checkCreatingAndParsingMessages = function(
  checkCreatingAndParsingMessage,
  messages, createMessage,
  parseMessage, extractMessageFromMessageWithHeader
) {
  for (const message of messages) {
    checkCreatingAndParsingMessage(
      message, createMessage,
      parseMessage, extractMessageFromMessageWithHeader
    );
  }
};

module.exports = createFnToCheckCreatingMessages;
