"use strict";

const _createTimeoutForSendingMessages = require("./../../utils/createTimeoutForPromise");

const createFnToCheckSendingMalformedMessages = function(brokenMessages, setListenerOfMalformedMessage, sendMessage) {
  return _checkSendingMalformedMessages.bind(null, brokenMessages, setListenerOfMalformedMessage, sendMessage);
};

const _checkSendingMalformedMessages = function(
  brokenMessages,
  setListenerOfMalformedMessage,
  sendMessage,
  sender,
  receiver
) {
  return new Promise(function(resolve, reject) {
    const totalCountOfSendedMalformedMessages = brokenMessages.length;
    let countOfReceivedMalformedMessages = 0;

    setListenerOfMalformedMessage(receiver, function() {
      countOfReceivedMalformedMessages += 1;
      if (countOfReceivedMalformedMessages === totalCountOfSendedMalformedMessages) {
        clearTimeout(timeoutForSendingMessages);
        resolve();
      }
    });

    const maxTimeMsForSendingAllMessages = 290;
    const timeoutForSendingMessages = _createTimeoutForSendingMessages(reject, maxTimeMsForSendingAllMessages);

    _sendMalformedMessages(sender.asWebSocketConnection(), brokenMessages, sendMessage);
  });
};

const _sendMalformedMessages = function(webSocketConnection, brokenMessages, sendMessage) {
  for (const brokenMessage of brokenMessages) {
    sendMessage(webSocketConnection, brokenMessage);
  }
}

module.exports = createFnToCheckSendingMalformedMessages;

