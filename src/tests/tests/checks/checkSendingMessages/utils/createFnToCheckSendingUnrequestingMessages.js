"use strict";

const isDeepEqual = require("util").isDeepStrictEqual;

const wait = function(timeMS) {
  return new Promise(function(resplve) {
    return setTimeout(resolve, timeMS);
  });
};

const createFnToCheckSendingUnrequestingMessages = function(
  sendedMessages,
  setUnrequestingMessageEventListener,
  sendMessage,
  extractMessageFromMessageWithHeader
) {
  return function(sender, receiver) {
    return checkSendingUnrequestingMessages(
      sender,
      receiver,
      sendedMessages,
      setUnrequestingMessageEventListener,
      sendMessage,
      extractMessageFromMessageWithHeader
    );
  };
};

const checkSendingUnrequestingMessages = async function(
  sender,
  receiver,
  sendedMessages,
  setUnrequestingMessageEventListener,
  sendMessage,
  extractMessageFromMessageWithHeader
) {
  return new Promise(function(resolve, reject) {
    const receivedMessages = [];
    let countOfMessages = sendedMessages.length;
    
    setUnrequestingMessageEventListener(receiver, function(rawMessage, startIndex) {
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
      sendMessage(sender, message);
    }
  });
};

module.exports = createFnToCheckSendingUnrequestingMessages;
