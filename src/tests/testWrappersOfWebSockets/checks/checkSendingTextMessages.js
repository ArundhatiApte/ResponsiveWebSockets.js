"use strict";

const createFnToCheckSendingMessages = require("./utils/createFnToCheckSendingMessages");

const sendedMessages = ["list", "of", "\u1291", "strings"];

const sendMessage = function(sender, message) {
  return sender.sendTextMessage(message);
};

const nameOfMessageEvent = "onTextMessage";

const extractMessageFromBody = function(string) {
  return string;
};

const createFnToCheckThatArraysOfSimpleValuesAreEqual = require("./utils/createFnToCheckThatArraysOfSimpleValuesAreEqual");

const areCollectionsOfMessagesEqual = createFnToCheckThatArraysOfSimpleValuesAreEqual(function(a, b) {
  return a < b ? -1 : (a > b ? 1 : 0);
});

const checkSendingTextMessages = createFnToCheckSendingMessages(
  sendedMessages, sendMessage,
  nameOfMessageEvent, extractMessageFromBody,
  areCollectionsOfMessagesEqual
);

module.exports = checkSendingTextMessages;
