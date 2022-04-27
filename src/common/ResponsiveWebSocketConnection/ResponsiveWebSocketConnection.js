"use strict";

const createEnum = require("createEnum");
const contentTypesOfMessages = createEnum("binary", "text");

const GeneratorOfRequestId = require("./modules/SequenceGeneratorOfUint16/SequenceGeneratorOfUint16");

const startIndexOfBodyInBinaryResponse = require(
  "./modules/messaging/binaryMessages/abstractMessager"
).startIndexOfBodyInResponse;

const startIndexOfBodyInTextResponse = require(
  "./modules/messaging/textMessages/abstractMessager"
).startIndexOfBodyInResponse;

const TimeoutToReceiveResponseError = class extends Error {};

const ResponsiveWebSocketConnection = class {
  constructor() {
    this[_maxTimeMsToWaitResponse] = defaultMaxTimeMsToWaitResponse;
    this[_generatorOfRequestId] = new GeneratorOfRequestId();
    this[_idOfRequestToPromise] = new Map();
  }

  static contentTypesOfMessages = contentTypesOfMessages;
  static TimeoutToReceiveResponseError = TimeoutToReceiveResponseError;

  _asWebSocketConnection() {
    return this[_connection];
  }

  get startIndexOfBodyInBinaryResponse() {
    return startIndexOfBodyInBinaryResponse;
  }

  get startIndexOfBodyInTextResponse() {
    return startIndexOfBodyInTextResponse;
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

  setTextRequestListener(listnerOrNull) {
    this[_onTextRequest] = listnerOrNull;
  }

  setMalformedBinaryMessageListener(listnerOrNull) {
    this[_onMalformedBinaryMessage] = listnerOrNull;
  }

  setMalformedTextMessageListener(listnerOrNull) {
    this[_onMalformedTextMessage] = listnerOrNull;
  }

  setUnrequestingBinaryMessageListener(listnerOrNull) {
    this[_onUnrequestingBinaryMessage] = listnerOrNull;
  }

  setUnrequestingTextMessageListener(listnerOrNull) {
    this[_onUnrequestingTextMessage] = listnerOrNull;
  }

  setCloseListener(listnerOrNull) {
    this[_onClose] = listnerOrNull;
  }
};

const _connection = Symbol(),
      _generatorOfRequestId = Symbol(),
      _idOfRequestToPromise = Symbol(),
      _maxTimeMsToWaitResponse = Symbol(),

      _onBinaryRequest = Symbol(),
      _onTextRequest = Symbol(),

      _onMalformedBinaryMessage = Symbol(),
      _onMalformedTextMessage = Symbol(),

      _onUnrequestingBinaryMessage = Symbol(),
      _onUnrequestingTextMessage = Symbol(),

      _onClose = Symbol();

const defaultMaxTimeMsToWaitResponse = 2000;

ResponsiveWebSocketConnection._namesOfPrivateProperties = {
  _connection,
  _generatorOfRequestId,
  _idOfRequestToPromise,
  _maxTimeMsToWaitResponse,

  _onBinaryRequest,
  _onTextRequest,

  _onMalformedBinaryMessage,
  _onMalformedTextMessage,

  _onUnrequestingBinaryMessage,
  _onUnrequestingTextMessage,
  _onClose
};

module.exports = ResponsiveWebSocketConnection;
