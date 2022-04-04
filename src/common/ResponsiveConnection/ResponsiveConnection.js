"use strict";

const createEnum = require("createEnum");
const contentTypesOfMessages = createEnum("binary", "text");

const GeneratorOfRequestId = require("./utils/SequenceGeneratorOfUint16/SequenceGeneratorOfUint16");

const startIndexOfBodyInBinaryResponse = require(
  "./../messaging/textMessages/abstractMessager"
).startIndexOfBodyInResponse;

const startIndexOfBodyInTextResponse = require(
  "./../messaging/binaryMessages/abstractMessager"
).startIndexOfBodyInResponse;

const TimeoutToReceiveResponseException = class extends Error {};

const ResponsiveConnection = class {
  constructor() {
    this[_maxTimeMsToWaitResponse] = defaultMaxTimeMsToWaitResponse;
    this[_generatorOfRequestId] = new GeneratorOfRequestId();
    this[_idOfRequestToPromise] = new Map();
  }

  static contentTypesOfMessages = contentTypesOfMessages;
  static TimeoutToReceiveResponseException = TimeoutToReceiveResponseException;
  
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

const _connection = "_",
      _generatorOfRequestId = "_g",
      _idOfRequestToPromise = "_m",
      _maxTimeMsToWaitResponse = "_t",

      _onBinaryRequest = "_1",
      _onTextRequest = "_2",
      _onUnrequestingBinaryMessage = "_3",
      _onUnrequestingTextMessage = "_4",
      _onClose = "_5";

const defaultMaxTimeMsToWaitResponse = 2000;

ResponsiveConnection._namesOfPrivateProperties = {
  _connection,
  _generatorOfRequestId,
  _idOfRequestToPromise,
  _maxTimeMsToWaitResponse,
  
  _onBinaryRequest,
  _onTextRequest,
  _onUnrequestingBinaryMessage,
  _onUnrequestingTextMessage,
  _onClose
};

module.exports = ResponsiveConnection;
