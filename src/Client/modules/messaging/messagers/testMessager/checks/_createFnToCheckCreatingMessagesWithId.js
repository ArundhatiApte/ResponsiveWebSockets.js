"use strict";

const expectEqual = require("assert").strictEqual;

const createFnToCheckCreatingAndParsingMessagesWithId = function(typeOfMessage) {
  return checkCreatingAndParsingMessagesWithId.bind(null, typeOfMessage);
};

const checkCreatingAndParsingMessagesWithId = function(
  typeOfMessage,
  createMessage,
  bodies,
  startIndexOfBody,
  extractTypeOfIncomingMessage,
  extractIdOfMessage,
  extractMessageFromMessageWithHeader
) {
  for (let i = Math.pow(2, 16); i; ) {
    i -= 1;
    for (const body of bodies) {
      checkCreatingAndParsingMessageWithId(
        typeOfMessage,
        createMessage,
        i,
        body,
        startIndexOfBody,
        extractTypeOfIncomingMessage,
        extractIdOfMessage,
        extractMessageFromMessageWithHeader
      );
    }
  }
};

const checkCreatingAndParsingMessageWithId = function(
  typeOfMessage,
  createMessage,
  idOfMessage,
  body,
  startIndexOfBody,
  extractTypeOfIncomingMessage,
  extractIdOfMessage,
  extractMessageFromMessageWithHeader
) {
  const messageWithHeader = createMessage(idOfMessage, body);

  const type = extractTypeOfIncomingMessage(messageWithHeader);
  expectEqual(type, typeOfMessage);

  const extractedIdOfMessage = extractIdOfMessage(messageWithHeader);
  expectEqual(extractedIdOfMessage, idOfMessage);

  const response = extractMessageFromMessageWithHeader(messageWithHeader, startIndexOfBody);
  expectEqual(response, body);
};

module.exports = createFnToCheckCreatingAndParsingMessagesWithId;
