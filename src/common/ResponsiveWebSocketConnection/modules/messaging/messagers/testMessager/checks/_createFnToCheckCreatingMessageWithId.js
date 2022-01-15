"use strict";

const expectEqual = require("assert").strictEqual;

const createFnToCheckCreatingAndParsingMessageWithId = function(idOfMessage, typeOfMessage) {
  return checkCreatingAndParsingMessageWithId.bind(null, idOfMessage, typeOfMessage);
};

const checkCreatingAndParsingMessageWithId = function(
  idOfMessage, typeOfMessage,
  message, createMessage,
  parseMessage, extractMessageFromMessageWithHeader
) {
  const messageWithHeader = createMessage(idOfMessage, message);
  const {
    idOfMessage: parsedIdOfMessage,
    startIndex,
    type
  }= parseMessage(messageWithHeader);

  expectEqual(parsedIdOfMessage, idOfMessage);
  expectEqual(type, typeOfMessage);
  const response = extractMessageFromMessageWithHeader(messageWithHeader, startIndex);
  expectEqual(response, message);
};

module.exports = createFnToCheckCreatingAndParsingMessageWithId;
