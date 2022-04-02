"use strict";

const testMessager = require("./../testMessager/testMessager");

const {
  numberToInt32Bytes,
  int32BytesToNumber
} = require("./../../../../../tests/modules/bytesInNumbers");      

const {
  createRequestMessage,
  createUnrequestingMessage,
  createResponseMessage,
  
  extractTypeOfIncomingMessage,
  extractIdOfMessage,
  
  startIndexOfBodyInRequest,
  startIndexOfBodyInUnrequestingMessage,
  startIndexOfBodyInResponse
} = require("./binaryMessager");

const messages = [12, 1923, 1237, 9, 9128];

const brokenMessage = (function() {
  const headerThatNotExist = 99,
        sendedNum = 999;
  return (new Uint8Array([headerThatNotExist, sendedNum])).buffer;
})();

const createFnToCreateBinaryMessageWithIdFromNumber = function(createBinaryMessage) {
  return function createdBinaryMessageCreator(idOfMessage, number) {
    return createBinaryMessage(idOfMessage, numberToInt32Bytes(number));
  };
};

testMessager({
  nameOfTest: "test binary messager",
  messages,
  createRequestMessage: createFnToCreateBinaryMessageWithIdFromNumber(createRequestMessage),
  createUnrequestingMessage(number) {
    return createUnrequestingMessage(numberToInt32Bytes(number));
  },
  createResponseMessage: createFnToCreateBinaryMessageWithIdFromNumber(createResponseMessage),
  
  extractTypeOfIncomingMessage,
  extractIdOfMessage,
  
  startIndexOfBodyInRequest,
  startIndexOfBodyInUnrequestingMessage,
  startIndexOfBodyInResponse,
  
  extractMessageFromMessageWithHeader(rawMessage, startIndex) {
    return int32BytesToNumber(rawMessage, startIndex);
  },
  brokenMessage
});
