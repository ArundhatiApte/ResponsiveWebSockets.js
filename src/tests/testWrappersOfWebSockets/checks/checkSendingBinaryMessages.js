"use strict";

const createFnToCheckSendingMessages = require("./utils/createFnToCheckSendingMessages");

const sendedNumbers = [4, 8, 16, 32, 64];

const sendNumber = function(sender, number) {
  const bytes = bytesFromInt(number)
  sender.sendBinaryMessage(bytes);
};

const nameOfMessageEvent = "onBinaryMessage";

const extractMessageFromBody = function(bytes) {
  return intFromBytes(bytes);
};

const createFnToCheckThatArraysOfSimpleValuesAreEqual = require("./utils/createFnToCheckThatArraysOfSimpleValuesAreEqual");

const areCollectionsOfMessagesEqual = createFnToCheckThatArraysOfSimpleValuesAreEqual(function compareNums(a, b) {
  return a - b;
});

const checkSendingBinaryMessages = createFnToCheckSendingMessages(
  sendedNumbers, sendNumber,
  nameOfMessageEvent, extractMessageFromBody,
  areCollectionsOfMessagesEqual
);

const intFromBytes = function(bytes) {
  return (new Int32Array(bytes))[0];
};

const bytesFromInt = function(integer) {
  return (new Int32Array([integer])).buffer;
};

module.exports = checkSendingBinaryMessages;
