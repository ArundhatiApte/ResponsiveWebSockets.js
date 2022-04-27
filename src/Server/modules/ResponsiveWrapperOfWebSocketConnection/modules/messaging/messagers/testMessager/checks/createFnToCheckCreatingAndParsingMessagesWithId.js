"use strict";

const expectEqual = require("assert").strictEqual;

const createFnToCheckCreatingAndParsingMessagesWithId = function(typeOfMessage) {
  return checkCreatingAndParsingMessagesWithId.bind(null, typeOfMessage);
};

const checkCreatingAndParsingMessagesWithId = function(
  typeOfMessage,
  createHeaderOfMessageByServer,
  createMessageByClient,
  bodyOfMessage,
  extractTypeOfIncomingMessage,
  extractIdOfMessage
) {
  for (let i = 0; i < maxIdOfMessagePlus1; i += 1) {
    checkCreatingAndParsingMessageWithId(
      typeOfMessage,
      createHeaderOfMessageByServer,
      i,
      createMessageByClient,
      bodyOfMessage,
      extractTypeOfIncomingMessage,
      extractIdOfMessage
    );
  }
};

const maxIdOfMessagePlus1 = Math.pow(2, 16);

const checkCreatingAndParsingMessageWithId = function(
  typeOfMessage,
  createHeaderOfMessageByServer,
  idOfMessage,
  createMessageByClient,
  bodyOfMessage,
  extractTypeOfIncomingMessage,
  extractIdOfMessage
) {
  const header = createHeaderOfMessageByServer(idOfMessage);
  const messageWithHeader = createMessageByClient(idOfMessage, bodyOfMessage);

  let extractedType = extractTypeOfIncomingMessage(header);
  expectEqual(extractedType, typeOfMessage);

  extractedType = extractTypeOfIncomingMessage(messageWithHeader);
  expectEqual(extractedType, typeOfMessage);

  let extractedId = extractIdOfMessage(header);
  expectEqual(extractedId, idOfMessage);

  extractedId = extractIdOfMessage(messageWithHeader);
  expectEqual(extractedId, idOfMessage);
};

const encodeTextToBytes = TextEncoder.prototype.encode.bind(new TextEncoder("utf-8"));

module.exports = createFnToCheckCreatingAndParsingMessagesWithId;
