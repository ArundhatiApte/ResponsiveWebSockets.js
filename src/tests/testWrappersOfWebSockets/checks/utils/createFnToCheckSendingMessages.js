"use strict";

const expect = require("assert");

const checkSendingMessages = function(
  sender, recivier,
  sendedMessages, sendMessage,
  nameOfMessageEvent, extractMessageFromBody,
  areCollectionsOfMessagesEqual
) {
  return new Promise(function (resolve, reject) {
    const countOfSendedMessages = sendedMessages.length,
          reciviedMessages = [];
    let countOfRecivedMessages = 0;
    
    const maxTimeMSToWaitSending = 1500;
    const timeout = setTimeout(function() {
      return reject(new Error("Timeout for reciving messages."));
    }, maxTimeMSToWaitSending);
    
    recivier[nameOfMessageEvent] = function(incomingMessage) {
      const message = extractMessageFromBody(incomingMessage);
      reciviedMessages.push(message);
      countOfRecivedMessages += 1;
      
      if (countOfRecivedMessages === countOfSendedMessages) {
        clearTimeout(timeout);
        if (areCollectionsOfMessagesEqual(sendedMessages, reciviedMessages)) {
          resolve();
        } else {
          console.log(sendedMessages, reciviedMessages);
          reject(new Error("Messages are not equal."));
        }
      }
    };

    for (const message of sendedMessages) {
      sendMessage(sender, message);
    }
  });
};

const createFnToCheckSendingMessages = function(
  sendedMessages, sendMessage,
  nameOfMessageEvent, extractMessageFromBody,
  areCollectionsOfMessagesEqual
) {
  return function(sender, recivier) {
    return checkSendingMessages(
      sender, recivier,
      sendedMessages, sendMessage,
      nameOfMessageEvent, extractMessageFromBody,
      areCollectionsOfMessagesEqual
    );
  };
};

module.exports = createFnToCheckSendingMessages;
