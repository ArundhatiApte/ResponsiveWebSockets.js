"use strict";

const expectTrue = require("assert").ok;

const createFnToCheckSendingFragmentsOfUnrequestingMessage = function(
  fragmentsOfMessage,
  sendFragmentsOfUnrequestingMessage,
  fullMessage,
  setListenerOfUnrequestingMessage,
  areMessagesEqual
) {
  return _checkSendingFragmentsOfUnrequestingMessage.bind(
    null,
    fragmentsOfMessage,
    sendFragmentsOfUnrequestingMessage,
    fullMessage,
    setListenerOfUnrequestingMessage,
    areMessagesEqual
  );
};

const _checkSendingFragmentsOfUnrequestingMessage = function(
  fragmentsOfMessage,
  sendFragmentsOfUnrequestingMessage,
  fullMessage,
  setListenerOfUnrequestingMessage,
  areMessagesEqual,
  sender,
  receiver
) {
  return new Promise(function(resolve, reject) {
    setListenerOfUnrequestingMessage(receiver, function(messageWithHeader, startIndex) {
      if (areMessagesEqual(fullMessage, 0, messageWithHeader, startIndex)) {
        resolve();
      } else {
        reject(new Error("Messages are different."));
      }
    });
    sendFragmentsOfUnrequestingMessage(sender, fragmentsOfMessage);
  });
};

module.exports = createFnToCheckSendingFragmentsOfUnrequestingMessage;
