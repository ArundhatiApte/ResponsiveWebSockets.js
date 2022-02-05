"use strict";

const expectEqual = require("assert").strictEqual;

const contentTypesOfMessages = require(
  "./../../../common/ResponsiveWebSocketConnection/ResponsiveWebSocketConnection"
).contentTypesOfMessages;

const {
  numberToInt32Bytes,
  int32BytesToNumber
} = require("./../../modules/bytesInNumbers");

const checkSendingTextResponseOnBinaryAndBinaryResponseOnTextMessages = async function(
  sender, receiver
) {
  await checkSendingTextResponsesOnBinaryMessage(sender, receiver);
  await checkSendingBinaryResponsesOnTextMessage(sender, receiver);
};

const checkSendingTextResponsesOnBinaryMessage = async function(sender, receiver) {
  const binaryMessage = numberToInt32Bytes(123456),
        textResponse = "n:123456";

  receiver.setAwaitingResponseBinaryMessageListener(function(messageWithHeader, startIndex, senderOfResponse) {
    return senderOfResponse.sendTextResponse(textResponse);
  });
  const {
    message, startIndex, contentType
  } = await sender.sendAwaitingResponseBinaryMessage(binaryMessage);

  expectEqual(contentType, contentTypesOfMessages.text);
  expectEqual(textResponse, message.slice(startIndex));
};

const checkSendingBinaryResponsesOnTextMessage = async function(sender, receiver) {
  const textMessage = "textMessage",
        numberInBinaryResponse = 123456;

  receiver.setAwaitingResponseTextMessageListener(function(messageWithHeader, startIndex, senderOfResponse) {
    return senderOfResponse.sendBinaryResponse(numberToInt32Bytes(numberInBinaryResponse));
  });
  const {
    message, startIndex, contentType
  } = await sender.sendAwaitingResponseTextMessage(textMessage);
  const reciviedNumber = int32BytesToNumber(message, startIndex);

  expectEqual(contentType, contentTypesOfMessages.binary);
  expectEqual(numberInBinaryResponse, reciviedNumber);
};

module.exports = checkSendingTextResponseOnBinaryAndBinaryResponseOnTextMessages;
