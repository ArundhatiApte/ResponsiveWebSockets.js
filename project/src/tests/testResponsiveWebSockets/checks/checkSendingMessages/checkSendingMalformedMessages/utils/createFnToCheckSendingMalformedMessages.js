"use strict";

const _createTimeoutForSendingMessages = require("./../../utils/createTimeoutForPromise");

const createFnToCheckSendingMalformedMessages = function(
  malformedMessages,
  nameOfSettingListenerOfMalformedMessageMethod,
  sendMessageByWebSocket
) {
  return _checkSendingMalformedMessages.bind(
    null,
    malformedMessages,
    nameOfSettingListenerOfMalformedMessageMethod,
    sendMessageByWebSocket
  );
};

const _checkSendingMalformedMessages = function(
  malformedMessages,
  nameOfSettingListenerOfMalformedMessageMethod,
  sendMessageByWebSocket,
  sender,
  receiver
) {
  return new Promise(function(resolve, reject) {
    const totalCountOfSendedMalformedMessages = malformedMessages.length;
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

    _sendMalformedMessages(sender._asWebSocketConnection(), malformedMessages, sendMessageByWebSocket);
  });
};

const _sendMalformedMessages = function(webSocketConnection, malformedMessages, sendMessageByWebSocket) {
  for (const malformedMessage of malformedMessages) {
    sendMessageByWebSocket(webSocketConnection, malformedMessage);
  }
}

module.exports = createFnToCheckSendingMalformedMessages;

