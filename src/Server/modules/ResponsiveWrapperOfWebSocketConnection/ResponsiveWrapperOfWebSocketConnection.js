"use strict";

const ResponsiveConnection = require("./../../../common/ResponsiveConnection/ResponsiveConnection");

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

const {
  binary: contentTypesOfMessages_binary,
  text: contentTypesOfMessages_text
} = ResponsiveConnection.contentTypesOfMessages;

const {
  binaryMessager: {
    extractTypeOfIncomingMessage: extractTypeOfIncomingBinaryMessage,
    extractIdOfMessage: extractIdOfBinaryMessage,
    headerOfUnrequestingMessage: headerOfUnrequestingBinaryMessage,
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

  sendUnrequestingBinaryMessage(message) {
    return sendUnrequestingMessage(this, headerOfUnrequestingBinaryMessage, true, message);
  }

  sendUnrequestingTextMessage(message) {
    return sendUnrequestingMessage(this, headerOfUnrequestingTextMessage, false, message);
  }

  sendBinaryRequest = sendBinaryRequest;
  sendTextRequest = sendTextRequest;

  sendFragmentsOfBinaryRequest = sendFragmentsOfBinaryRequest;
  sendFragmentsOfTextRequest = sendFragmentsOfTextRequest;
};

module.exports = ResponsiveWrapperOfWebSocketConnection;

const sendUnrequestingMessage = function(
  responsiveConnection,
  headerOfUnrequestingMessage,
  isMessageBinary,
  message
) {
  const connection = this[_connection];
  connection.sendFirstFragment(headerOfUnrequestingMessage, isMessageBinary);
  connection.sendLastFragment(message, isMessageBinary);
};

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
  
    responsiveWrapper,
    message
  );
};
