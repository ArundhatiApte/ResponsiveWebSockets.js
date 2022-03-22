"use strict";

const testMessager = require("./../testMessager/testMessager");

const {
  numberToInt32Bytes,
  int32BytesToNumber
} = require("./../../../../../../tests/modules/bytesInNumbers");      

const {
  createAwaitingResponseBinaryMessage,
  createUnrequestingBinaryMessage,
  createBinaryResponseToAwaitingResponseMessage,

  extractTypeOfIncomingMessage,
  extractIdOfMessage,
  
  startIndexOfAwaitingResponseMessageBody,
  startIndexOfUnrequestingMessageBody,
  startIndexOfResponseMessageBody
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
  createAwaitingResponseMessage: createFnToCreateBinaryMessageWithIdFromNumber(
    createAwaitingResponseBinaryMessage
  ),
  createUnrequestingMessage(number) {
    return createUnrequestingBinaryMessage(numberToInt32Bytes(number));
  },
  createResponseMessage: createFnToCreateBinaryMessageWithIdFromNumber(
    createBinaryResponseToAwaitingResponseMessage
  ),
  
  extractTypeOfIncomingMessage,
  extractIdOfMessage,
  
  startIndexOfAwaitingResponseMessageBody,
  startIndexOfUnrequestingMessageBody,
  startIndexOfResponseMessageBody,
  extractMessageFromMessageWithHeader(rawMessage, startIndex) {
    return int32BytesToNumber(rawMessage, startIndex);
  },
  brokenMessage
});
