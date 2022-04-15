"use strict";

const ResponsiveConnection = require("./../../../common/ResponsiveConnection/ResponsiveConnection");

const {
  _connection,
  _onMalformedBinaryMessage,
  _onMalformedTextMessage,

  _onBinaryRequest,
  _onTextRequest,

  _onUnrequestingBinaryMessage,
  _onUnrequestingTextMessage,
  _onClose
} = ResponsiveConnection._namesOfPrivateProperties;

const {
  binary: contentTypesOfMessages_binary,
  text: contentTypesOfMessages_text
} = ResponsiveConnection.contentTypesOfMessages;

const { _userData } = require("./../AcceptorOfRequestForUpgrade");

const {
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

const ResponsiveWrapperOfWebSocketConnection = class extends ResponsiveConnection {
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

  sendBinaryRequest = sendBinaryRequest;
  sendTextRequest = sendTextRequest;

  sendFragmentsOfBinaryRequest = sendFragmentsOfBinaryRequest;
  sendFragmentsOfTextRequest = sendFragmentsOfTextRequest;

  sendUnrequestingBinaryMessage = sendUnrequestingBinaryMessage;
  sendUnrequestingTextMessage = sendUnrequestingTextMessage;

  sendFragmentsOfUnrequestingBinaryMessage = sendFragmentsOfUnrequestingBinaryMessage;
  sendFragmentsOfUnrequestingTextMessage = sendFragmentsOfUnrequestingTextMessage;
};

module.exports = ResponsiveWrapperOfWebSocketConnection;

const listenEventOfMessageToInnerWebSocket = require(
  "./../../../common/ResponsiveConnection/utils/listenEventOfMessageToInnerWebSocket"
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
