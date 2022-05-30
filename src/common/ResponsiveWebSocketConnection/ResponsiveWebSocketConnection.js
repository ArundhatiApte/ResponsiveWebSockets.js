"use strict";

const createGeneratorOfRequestId = require("./modules/createSequenceGeneratorOfInts/createSequenceGeneratorOfInts");

const startIndexOfBodyInBinaryResponse = require(
  "./modules/messaging/binaryMessages/binaryMessager"
).sizeOfHeaderForResponse;

const TimeoutToReceiveResponseError = class extends Error {};

const ResponsiveWebSocketConnection = class {
  constructor() {
    this[_maxTimeMsToWaitResponse] = _defaultMaxTimeMsToWaitResponse;
    this[_getNextIdOfRequest] = createGeneratorOfRequestId(Uint16Array);
    this[_idOfRequestToPromise] = new Map();

    this[_onBinaryRequest] = _emptyFunction;
    this[_onUnrequestingBinaryMessage] = _emptyFunction;
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

  setBinaryRequestListener(listener) {
    return _setListenerOfEvents(this, _onBinaryRequest, listener);
  }

  setMalformedBinaryMessageListener(listener) {
    this[_onMalformedBinaryMessage] = listener;
  }

  setTextMessageListener(listener) {
    this[_onTextMessage] = listener;
  }

  setUnrequestingBinaryMessageListener(listener) {
    return _setListenerOfEvents(this, _onUnrequestingBinaryMessage, listener);
  }

  setCloseListener(listener) {
    this[_onClose] = listener;
  }
};

const _connection = Symbol(),
      _getNextIdOfRequest = Symbol(),
      _idOfRequestToPromise = Symbol(),
      _maxTimeMsToWaitResponse = Symbol(),

      _onBinaryRequest = Symbol("br"),
      _onMalformedBinaryMessage = Symbol(),
      _onUnrequestingBinaryMessage = Symbol(),
      _onTextMessage = Symbol(),

      _onClose = Symbol();

const _defaultMaxTimeMsToWaitResponse = 2000;

const _emptyFunction = function() {};

const _setListenerOfEvents = function(responsiveWebSocketConnection, nameOfEvent, listener) {
  if (typeof listener !== "function") {
    throw new Error("Listener is different from function.");
  }
  responsiveWebSocketConnection[nameOfEvent] = listener;
};
ResponsiveWebSocketConnection._setListenerOfEvents = _setListenerOfEvents;

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
