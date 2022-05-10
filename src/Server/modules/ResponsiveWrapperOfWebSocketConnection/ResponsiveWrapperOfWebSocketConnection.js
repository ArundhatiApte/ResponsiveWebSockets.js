"use strict";

const ResponsiveWebSocketConnection = require(
  "./../../../common/ResponsiveWebSocketConnection/ResponsiveWebSocketConnection"
);

const {
  _connection,

  _onBinaryRequest,
  _onMalformedBinaryMessage,
  _onUnrequestingBinaryMessage,
  _onTextMessage,

  _onClose
} = ResponsiveWebSocketConnection._namesOfPrivateProperties;

const { _userData } = require("./../AcceptorOfRequestForUpgrade");

const {
  extractTypeOfMessage: extractTypeOfBinaryMessage,
  extractIdOfMessage: extractIdOfBinaryMessage,

  fillHeaderAsUnrequestingMessage: fillHeaderAsUnrequestingBinaryMessage,

  sizeOfHeaderForRequest: sizeOfHeaderForBinaryRequest,
  sizeOfHeaderForResponse: sizeOfHeaderForBinaryResponse,
  sizeOfHeaderForUnrequestingMessage: sizeOfHeaderForUnrequestingBinaryMessage
} = require("./../../../common/ResponsiveWebSocketConnection/modules/messaging/binaryMessages/binaryMessager");

const EventOfClosing = require("./modules/EventOfClosing");

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

// sizeOfHeaderForBinaryRequest === sizeOfHeaderForBinaryResponse
ResponsiveWrapperOfWebSocketConnection._bufferForHeaderOfRequestOrResponse = new ArrayBuffer(
  sizeOfHeaderForBinaryRequest
);
ResponsiveWrapperOfWebSocketConnection._headerOfUnrequestingMessage = new ArrayBuffer(
  sizeOfHeaderForUnrequestingBinaryMessage
);
fillHeaderAsUnrequestingBinaryMessage(ResponsiveWrapperOfWebSocketConnection._headerOfUnrequestingMessage);

module.exports = ResponsiveWrapperOfWebSocketConnection;

const SenderOfResponse = require("./modules/SenderOfResponse");

const Proto = ResponsiveWrapperOfWebSocketConnection.prototype;

Proto.sendBinaryRequest = require("./modules/sendBinaryRequest");;
Proto.sendFragmentsOfBinaryRequest = require("./modules/sendFragmentsOfBinaryRequest");;
Proto.sendUnrequestingBinaryMessage = require("./modules/sendUnrequestingBinaryMessage");;
Proto.sendFragmentsOfUnrequestingBinaryMessage = require("./modules/sendFragmentsOfUnrequestingBinaryMessage");;

const _acceptMessageFromInnerWebSocket = require(
  "./../../../common/ResponsiveWebSocketConnection/utils/acceptMessageFromInnerWebSocket"
);

const _startIndexOfBodyInUnrequestingBinaryMessage = sizeOfHeaderForUnrequestingBinaryMessage;
const _startIndexOfBodyInBinaryRequest = sizeOfHeaderForBinaryRequest;

ResponsiveWrapperOfWebSocketConnection._acceptBinaryMessage = function(responsiveWrapper, message) {
  return _acceptMessageFromInnerWebSocket(
    extractTypeOfBinaryMessage,
    extractIdOfBinaryMessage,

    _onUnrequestingBinaryMessage,
    _startIndexOfBodyInUnrequestingBinaryMessage,

    _onBinaryRequest,
    _startIndexOfBodyInBinaryRequest,
    SenderOfResponse,

    _onMalformedBinaryMessage,

    responsiveWrapper,
    message
  );
};

ResponsiveWrapperOfWebSocketConnection._acceptTextMessage = ResponsiveWebSocketConnection._acceptTextMessage;

ResponsiveWrapperOfWebSocketConnection._acceptEventOfClosing = function(
  responsiveWrapper,
  code,
  reasonInArrayBufferInUTF8
) {
  if (responsiveWrapper[_onClose]) {
    responsiveWrapper[_onClose](new EventOfClosing(code, reasonInArrayBufferInUTF8));
  }
};
