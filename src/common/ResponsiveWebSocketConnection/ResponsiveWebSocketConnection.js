"use strict";

const createGeneratorOfRequestId = require("./modules/createSequenceGeneratorOfInts/createSequenceGeneratorOfInts");

const startIndexOfBodyInBinaryResponse = require(
  "./modules/messaging/binaryMessages/binaryMessager"
).sizeOfHeaderForResponse;

const TimeoutToReceiveResponseError = class extends Error {};

const ResponsiveWebSocketConnection = class {
  constructor() {
    this[_maxTimeMsToWaitResponse] = defaultMaxTimeMsToWaitResponse;
    this[_getNextIdOfRequest] = createGeneratorOfRequestId(Uint16Array);
    this[_idOfRequestToPromise] = new Map();
  }

  static TimeoutToReceiveResponseError = TimeoutToReceiveResponseError;

  _asWebSocketConnection() {
    return this[_connection];
  }

  get startIndexOfBodyInBinaryResponse() {
    return startIndexOfBodyInBinaryResponse;
  }

  setMaxTimeMsToWaitResponse(ms) {
    this[_maxTimeMsToWaitResponse] = ms;
  }

  get url() {
    return this[_connection].url;
  }

  setBinaryRequestListener(listnerOrNull) {
    this[_onBinaryRequest] = listnerOrNull;
  }

  setMalformedBinaryMessageListener(listnerOrNull) {
    this[_onMalformedBinaryMessage] = listnerOrNull;
  }

  setTextMessageListener(listnerOrNull) {
    this[_onTextMessage] = listnerOrNull;
  }

  setUnrequestingBinaryMessageListener(listnerOrNull) {
    this[_onUnrequestingBinaryMessage] = listnerOrNull;
  }

  setCloseListener(listnerOrNull) {
    this[_onClose] = listnerOrNull;
  }
};

const _connection = Symbol(),
      _getNextIdOfRequest = Symbol(),
      _idOfRequestToPromise = Symbol(),
      _maxTimeMsToWaitResponse = Symbol(),

      _onBinaryRequest = Symbol(),
      _onMalformedBinaryMessage = Symbol(),
      _onUnrequestingBinaryMessage = Symbol(),
      _onTextMessage = Symbol(),

      _onClose = Symbol();

const defaultMaxTimeMsToWaitResponse = 2000;

ResponsiveWebSocketConnection._namesOfPrivateProperties = {
  _connection,
  _getNextIdOfRequest,
  _idOfRequestToPromise,
  _maxTimeMsToWaitResponse,

  _onBinaryRequest,
  _onMalformedBinaryMessage,
  _onUnrequestingBinaryMessage,
  _onTextMessage,

  _onClose
};

ResponsiveWebSocketConnection._acceptTextMessage = function(responsiveWebSocketConnection, message) {
  if (responsiveWebSocketConnection[_onTextMessage]) {
    responsiveWebSocketConnection[_onTextMessage](message);
  }
};

module.exports = ResponsiveWebSocketConnection;
