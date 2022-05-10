"use strict";

const _createTimeoutForSendingMessages = require("./../../utils/createTimeoutForPromise");

const createFnToCheckSendingMalformedMessages = function(
  brokenMessages,
  nameOfSettingListenerOfMalformedMessageMethod,
  sendMessageByWebSocket
) {
  return _checkSendingMalformedMessages.bind(
    null,
    brokenMessages,
    nameOfSettingListenerOfMalformedMessageMethod,
    sendMessageByWebSocket
  );
};

const _checkSendingMalformedMessages = function(
  brokenMessages,
  nameOfSettingListenerOfMalformedMessageMethod,
  sendMessageByWebSocket,
  sender,
  receiver
) {
  return new Promise(function(resolve, reject) {
    const totalCountOfSendedMalformedMessages = brokenMessages.length;
    let countOfReceivedMalformedMessages = 0;

    receiver[nameOfSettingListenerOfMalformedMessageMethod](function() {
      countOfReceivedMalformedMessages += 1;
      if (countOfReceivedMalformedMessages === totalCountOfSendedMalformedMessages) {
        clearTimeout(timeoutForSendingMessages);
        resolve();
      }
    });

    const maxTimeMsForSendingAllMessages = 290;
    const timeoutForSendingMessages = _createTimeoutForSendingMessages(reject, maxTimeMsForSendingAllMessages);

    _sendMalformedMessages(sender._asWebSocketConnection(), brokenMessages, sendMessageByWebSocket);
  });
};

const _sendMalformedMessages = function(webSocketConnection, brokenMessages, sendMessageByWebSocket) {
  for (const brokenMessage of brokenMessages) {
    sendMessageByWebSocket(webSocketConnection, brokenMessage);
  }
}

module.exports = createFnToCheckSendingMalformedMessages;

