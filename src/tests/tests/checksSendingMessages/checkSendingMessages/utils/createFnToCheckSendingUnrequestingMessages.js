"use strict";

const expectDeepEqual = require("assert").deepStrictEqual;

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
    return createFnToCheckSendingUnrequestingMessages(
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
  const receivedMessages = [];
        
  setUnrequestingMessageEventListener(receiver, function(rawMessage, startIndex) {
    const message = extractMessageFromMessageWithHeader(rawMessage, startIndex);
    receivedMessages.push(message);
  });

  for (const message of sendedMessages) {
    sendMessage(sender, message);
  }
  
  await wait(timeMSToSend);
  expectDeepEqual(sendedMessages, receivedMessages);
};

const timeMSToSend = 489;

module.exports = createFnToCheckSendingUnrequestingMessages;
