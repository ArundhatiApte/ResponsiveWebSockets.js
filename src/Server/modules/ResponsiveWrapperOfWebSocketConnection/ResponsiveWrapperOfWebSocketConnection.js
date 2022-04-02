"use strict";

const ResponsiveConnection = require("./../../../common/ResponsiveConnection/ResponsiveConnection");

const {
  binaryMessager,
  textMessager
} = require("./modules/messaging/messaging");

const ResponsiveWrapperOfWebSocketConnection = class extends ResponsiveConnection {
  constructor(uWSConnectionToClient) {
    super();
    this[_connection] = uWSConnectionToClient;
  }

  get userData() {
    return this[_connection].userData;
  }

  setErrorListener(listnerOrNull) {}

  close(code, reason) {
    return this[_connection].end(code, reason);
  }

  terminate() {
    return this[_connection].close();
  }

  _emitOnClose(code, reason) {
    if (this[_onClose]) {
      this[_onClose]({code, reason});
    }
  }
};

module.exports = ResponsiveWrapperOfWebSocketConnection;

const {
  _connection,
  _generatorOfRequestId,
  _idOfRequestToPromise,
  _maxTimeMsToWaitResponse,
  _onBinaryRequest,
  _onTextRequest,
  _onUnrequestingBinaryMessage,
  _onUnrequestingTextMessage,
  _onClose
} = ResponsiveConnection._namesOfPrivateProperties;

const Proto = ResponsiveWrapperOfWebSocketConnection.prototype;
const messageIsBinary = true;

const createSendingRequestMethod = require("./modules/createSendingRequestMethod");

Proto.sendBinaryRequest = createSendingRequestMethod(
  binaryMessager.createHeaderOfRequest,
  messageIsBinary
);
Proto.sendTextRequest = createSendingRequestMethod(textMessager.createHeaderOfRequest);

const createSendingFragmentsOfBinaryRequestFn = require("./modules/createSendingFragmentsOfBinaryRequestFn");

Proto.sendFragmentsOfBinaryRequest = createSendingFragmentsOfBinaryRequestFn(
  binaryMessager.createHeaderOfRequest,
  messageIsBinary
);
Proto.sendFragmentsOfTextRequest = createSendingFragmentsOfBinaryRequestFn(textMessager.createHeaderOfRequest);

const createSendingUnrequestingMessageMethod = function(headerOfUnrequestingMessage, isMessageBinary) {
  return function sendUnrequestingMessage(message) {
    const connection = this[_connection];
    connection.sendFirstFragment(headerOfUnrequestingMessage, isMessageBinary);
    connection.sendLastFragment(message, isMessageBinary);
  };
};

Proto.sendUnrequestingBinaryMessage = createSendingUnrequestingMessageMethod(
  binaryMessager.headerOfUnrequestingMessage,
  messageIsBinary
);
Proto.sendUnrequestingTextMessage = createSendingUnrequestingMessageMethod(
  textMessager.headerOfUnrequestingMessage
);

const createMethodToFireEventOnMessageToInnerWebSocket = require(
  "./../../../common/ResponsiveConnection/utils/createMethodToFireEventOnMessageToInnerWebSocket"
);
const SenderOfResponse = require("./modules/SenderOfResponse");

const createSenderOfResponse = function(rwsConnectionToClient, idOfMessage) {
  return new SenderOfResponse(rwsConnectionToClient[_connection], idOfMessage);
};

Proto._acceptBinaryMessage = createMethodToFireEventOnMessageToInnerWebSocket(
  _idOfRequestToPromise,
  binaryMessager.extractTypeOfIncomingMessage,
  binaryMessager.extractIdOfMessage,
  ResponsiveConnection.contentTypesOfMessages.binary,

  _onUnrequestingBinaryMessage,
  binaryMessager.startIndexOfBodyInUnrequestingMessage,

  _onBinaryRequest,
  binaryMessager.startIndexOfBodyInRequest,
  createSenderOfResponse
);

Proto._acceptTextMessage = createMethodToFireEventOnMessageToInnerWebSocket(
  _idOfRequestToPromise,
  textMessager.extractTypeOfIncomingMessage,
  textMessager.extractIdOfMessage,
  ResponsiveConnection.contentTypesOfMessages.text,

  _onUnrequestingTextMessage,
  textMessager.startIndexOfBodyInUnrequestingMessage,

  _onTextRequest,
  textMessager.startIndexOfBodyInRequest,
  createSenderOfResponse
);
