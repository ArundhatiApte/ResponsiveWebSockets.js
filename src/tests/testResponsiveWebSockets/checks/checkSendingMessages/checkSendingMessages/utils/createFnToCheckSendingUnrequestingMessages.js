"use strict";

const isDeepEqual = require("util").isDeepStrictEqual;

const wait = function(timeMs) {
  return new Promise(function(resplve) {
    return setTimeout(resolve, timeMs);
  });
};

const createFnToCheckSendingUnrequestingMessages = function(
  sendedMessages,
  nameOfSettingUnrequestingMessageEventListenerMethod,
  sendUnrequestingMessage,
  extractMessageFromMessageWithHeader
) {
  return checkSendingUnrequestingMessages.bind(
    null,
    sendedMessages,
    nameOfSettingUnrequestingMessageEventListenerMethod,
    sendUnrequestingMessage,
    extractMessageFromMessageWithHeader
  );
};

const checkSendingUnrequestingMessages = async function(
  sendedMessages,
  nameOfSettingUnrequestingMessageEventListenerMethod,
  sendUnrequestingMessage,
  extractMessageFromMessageWithHeader,
  sender,
  receiver,
) {
  return new Promise(function(resolve, reject) {
    const receivedMessages = [];
    let countOfMessages = sendedMessages.length;

    receiver[nameOfSettingUnrequestingMessageEventListenerMethod](function(rawMessage, startIndex) {
      const message = extractMessageFromMessageWithHeader(rawMessage, startIndex);
      receivedMessages.push(message);
      countOfMessages -= 1;
      if (countOfMessages === 0) {
        if (isDeepEqual(sendedMessages, receivedMessages)) {
          resolve();
        } else {
          reject(new Error("Different messages."));
        }
      }
    });

    for (const message of sendedMessages) {
      sendUnrequestingMessage(sender, message);
    }
  });
};

module.exports = createFnToCheckSendingUnrequestingMessages;
