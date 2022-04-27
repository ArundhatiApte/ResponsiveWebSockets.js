"use strict";

const ResponsiveWebSocketConnection = require(
  "./../../../common/ResponsiveWebSocketConnection/ResponsiveWebSocketConnection"
);

const {
  _connection,
  _onMalformedBinaryMessage,
  _onMalformedTextMessage,

  _onBinaryRequest,
  _onTextRequest,

  _onUnrequestingBinaryMessage,
  _onUnrequestingTextMessage,
  _onClose
} = ResponsiveWebSocketConnection._namesOfPrivateProperties;

const {
  binary: contentTypesOfMessages_binary,
  text: contentTypesOfMessages_text
} = ResponsiveWebSocketConnection.contentTypesOfMessages;

const { _userData } = require("./../AcceptorOfRequestForUpgrade");

const {
  sizeOfRequestOrResponseHeader,
  binaryMessager: {
    extractTypeOfIncomingMessage: extractTypeOfIncomingBinaryMessage,
    extractIdOfMessage: extractIdOfBinaryMessage,
    startIndexOfBodyInUnrequestingMessage: startIndexOfBodyInUnrequestingBinaryMessage,
    startIndexOfBodyInRequest: startIndexOfBodyInBinaryRequest
  },
  textMessager: {
    extractTypeOfIncomingMessage: extractTypeOfIncomingTextMessage,
    extractIdOfMessage: extractIdOfTextMessage,
    startIndexOfBodyInUnrequestingMessage: startIndexOfBodyInUnrequestingTextMessage,
    startIndexOfBodyInRequest: startIndexOfBodyInTextRequest
  }
} = require("./modules/messaging/messaging");

const ResponsiveWrapperOfWebSocketConnection = class extends ResponsiveWebSocketConnection {
  constructor(uWSConnectionToClient) {
    super();
    this[_connection] = uWSConnectionToClient;
  }

  getRemoteAddress() {
    return this[_connection].getRemoteAddress();
  }

  get userData() {
    return this[_connection][_userData];
  }

  setErrorListener(listnerOrNull) {}

  close(code, reason) {
    return this[_connection].end(code, reason);
  }

  terminate() {
    return this[_connection].close();
  }
};

const _symbolOfBufferForHeader = Symbol();
ResponsiveWrapperOfWebSocketConnection._symbolOfBufferForHeader = _symbolOfBufferForHeader;
ResponsiveWrapperOfWebSocketConnection[_symbolOfBufferForHeader] = new ArrayBuffer(sizeOfRequestOrResponseHeader);

module.exports = ResponsiveWrapperOfWebSocketConnection;

const SenderOfResponse = require("./modules/SenderOfResponse");

const {
  sendBinaryRequest,
  sendTextRequest
} = require("./modules/sendingRequestsMethods");

const {
  sendFragmentsOfBinaryRequest,
  sendFragmentsOfTextRequest
} = require("./modules/sendingFragmentsOfRequestMethods");

const {
  sendUnrequestingBinaryMessage,
  sendUnrequestingTextMessage
} = require("./modules/sendingUnrequestingMessageMethods");

const {
  sendFragmentsOfUnrequestingBinaryMessage,
  sendFragmentsOfUnrequestingTextMessage
} = require("./modules/sendingFragmentsOfUnrequestingMessageMethods");

const Proto = ResponsiveWrapperOfWebSocketConnection.prototype;

Proto.sendBinaryRequest = sendBinaryRequest;
Proto.sendTextRequest = sendTextRequest;

Proto.sendFragmentsOfBinaryRequest = sendFragmentsOfBinaryRequest;
Proto.sendFragmentsOfTextRequest = sendFragmentsOfTextRequest;

Proto.sendUnrequestingBinaryMessage = sendUnrequestingBinaryMessage;
Proto.sendUnrequestingTextMessage = sendUnrequestingTextMessage;

Proto.sendFragmentsOfUnrequestingBinaryMessage = sendFragmentsOfUnrequestingBinaryMessage;
Proto.sendFragmentsOfUnrequestingTextMessage = sendFragmentsOfUnrequestingTextMessage;

const listenEventOfMessageToInnerWebSocket = require(
  "./../../../common/ResponsiveWebSocketConnection/utils/listenEventOfMessageToInnerWebSocket"
);

ResponsiveWrapperOfWebSocketConnection._acceptBinaryMessage = function(responsiveWrapper, message) {
  return listenEventOfMessageToInnerWebSocket(
    extractTypeOfIncomingBinaryMessage,
    extractIdOfBinaryMessage,
    contentTypesOfMessages_binary,

    _onUnrequestingBinaryMessage,
    startIndexOfBodyInUnrequestingBinaryMessage,

    _onBinaryRequest,
    startIndexOfBodyInBinaryRequest,
    SenderOfResponse,

    _onMalformedBinaryMessage,

    responsiveWrapper,
    message
  );
};

ResponsiveWrapperOfWebSocketConnection._acceptTextMessage = function(responsiveWrapper, message) {
  return listenEventOfMessageToInnerWebSocket(
    extractTypeOfIncomingTextMessage,
    extractIdOfTextMessage,
    contentTypesOfMessages_text,

    _onUnrequestingTextMessage,
    startIndexOfBodyInUnrequestingTextMessage,

    _onTextRequest,
    startIndexOfBodyInTextRequest,
    SenderOfResponse,

    _onMalformedTextMessage,

    responsiveWrapper,
    message
  );
};

ResponsiveWrapperOfWebSocketConnection._emitOnClose = function(responsiveWrapper, code, reason) {
  if (responsiveWrapper[_onClose]) {
    responsiveWrapper[_onClose]({code, reason});
  }
};
