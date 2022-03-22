"use strict";

const createEnum = require("createEnum");

const {
  binaryMessager,
  textMessager
} = require("./modules/messaging/messaging");

const startIndexOfBodyInTextResponse = textMessager.startIndexOfResponseMessageBody;
const startIndexOfBodyInBinaryResponse = binaryMessager.startIndexOfResponseMessageBody;

const MessageIdGen = require(
  "./modules/createClassOfGeneratorOfSequenceIntegers/createClassOfGeneratorOfSequenceIntegers"
)(Uint16Array);

const messageContentTypes = createEnum("binary", "text");
const _defaultMaxTimeMSToWaitResponse = 4000;
const TimeoutToReceiveResponseExeption = class extends Error {};

const ResponsiveWebSocketConnection = class {
  constructor(nonResponsiveConnection) {
    this[_connection] = nonResponsiveConnection;
    this[_maxTimeMSToWaitResponse] = _defaultMaxTimeMSToWaitResponse;
    this[_genOfAwaitingResponseMessageId] = new MessageIdGen();
    this[_idOfAwaitingResponseMessageToPromise] = new Map();
    
    this[_onAwaitingResponseBinaryMessage] = null;
    this[_onUnrequestingBinaryMessage] = null;
    this[_onAwaitingResponseTextMessage] = null;
    this[_onUnrequestingTextMessage] = null;

    this._setupOnMessageListeners();
  }

  static contentTypesOfMessages = messageContentTypes;
  static TimeoutToReceiveResponseExeption = TimeoutToReceiveResponseExeption;
  
  get startIndexOfBodyInBinaryResponse() {
    return startIndexOfBodyInBinaryResponse;
  }
  
  get startIndexOfBodyInTextResponse() {
    return startIndexOfBodyInTextResponse;
  }
  
  set maxTimeMSToWaitResponse(ms) {
    this[_maxTimeMSToWaitResponse] = ms;
  }
  
  get maxTimeMSToWaitResponse() {
    return this[_maxTimeMSToWaitResponse];
  }

  get url() {
    return this[_connection].url;
  }

  setUnrequestingBinaryMessageListener(listener) {
    this[_onUnrequestingBinaryMessage] = listener;
  }
  
  setUnrequestingTextMessageListener(listener) {
    this[_onUnrequestingTextMessage] = listener;
  }

  setErrorListener(listener) {
    this[_connection].onError = listener ? listener.bind(this) : null;
  }

  setCloseListener(listener) {
    this[_connection].onClose = listener ? listener.bind(this) : null;
  }
  
  _setupOnMessageListeners() {
    const connection = this[_connection];
    
    let listener = this._emitEventByIncomingBinaryMessage.bind(this);
    connection.onBinaryMessage = listener;

    listener = this._emitEventByIncomingTextMessage.bind(this);
    connection.onTextMessage = listener;
  }
};

const _connection = "_c",
      _maxTimeMSToWaitResponse = "_m",
      _genOfAwaitingResponseMessageId = "_g",
      _idOfAwaitingResponseMessageToPromise = "_t",
      
      _onAwaitingResponseBinaryMessage = "_1",
      _onUnrequestingBinaryMessage = "_2",
      _onAwaitingResponseTextMessage = "_3",
      _onUnrequestingTextMessage = "_4",
      
      Proto = ResponsiveWebSocketConnection.prototype;

Proto.setAwaitingResponseBinaryMessageListener = Proto.setBinaryRequestListener = function(listener) {
  this[_onAwaitingResponseBinaryMessage] = listener;
};

Proto.setAwaitingResponseTextMessageListener = Proto.setTextRequestListener = function(listener) {
  this[_onAwaitingResponseTextMessage] = listener;
};

module.exports = ResponsiveWebSocketConnection;

ResponsiveWebSocketConnection._namesOfPrivateProperties = {
  _connection,
  _maxTimeMSToWaitResponse,
  _genOfAwaitingResponseMessageId,
  _idOfAwaitingResponseMessageToPromise,
  
  _onAwaitingResponseBinaryMessage,
  _onUnrequestingBinaryMessage,
  _onAwaitingResponseTextMessage,
  _onUnrequestingTextMessage
};

const createMethodToSetupOnMessageListenerOfInnerWebSocket =
  require("./creatingMethods/createMethodToSetupOnMessageListenerOfInnerWebSocket");

Proto._emitEventByIncomingBinaryMessage = createMethodToSetupOnMessageListenerOfInnerWebSocket(
  binaryMessager.extractTypeOfIncomingMessage,
  binaryMessager.extractIdOfMessage,
  
  messageContentTypes.binary,
  _onUnrequestingBinaryMessage,
  binaryMessager.startIndexOfUnrequestingMessageBody,
  _onAwaitingResponseBinaryMessage,
  binaryMessager.startIndexOfAwaitingResponseMessageBody
);

Proto._emitEventByIncomingTextMessage = createMethodToSetupOnMessageListenerOfInnerWebSocket(
  textMessager.extractTypeOfIncomingMessage,
  textMessager.extractIdOfMessage,
  
  messageContentTypes.text,
  _onUnrequestingTextMessage,
  textMessager.startIndexOfUnrequestingMessageBody,
  _onAwaitingResponseTextMessage,
  textMessager.startIndexOfAwaitingResponseMessageBody
);

const createMethodToSendUnrequestingMessage = function(createUnrequestingMessage, nameOfMethodToSendMessage) {
  return function sendUnrequestingMessage(message) {
    const messageWithHeader = createUnrequestingMessage(message);
    this[_connection][nameOfMethodToSendMessage](messageWithHeader);
  };
};

Proto.sendUnrequestingBinaryMessage = createMethodToSendUnrequestingMessage(
  binaryMessager.createUnrequestingBinaryMessage, "sendBinaryMessage"
);
Proto.sendUnrequestingTextMessage = createMethodToSendUnrequestingMessage(
  textMessager.createUnrequestingTextMessage, "sendTextMessage"
);

const createMethodToSendAwaitingResponseMessage =
  require("./creatingMethods/createMethodToSendAwaitingResponseMessage");

Proto.sendAwaitingResponseBinaryMessage = Proto.sendBinaryRequest = createMethodToSendAwaitingResponseMessage(
  binaryMessager.createAwaitingResponseBinaryMessage, "sendBinaryMessage"
);
Proto.sendAwaitingResponseTextMessage = Proto.sendTextRequest = createMethodToSendAwaitingResponseMessage(
  textMessager.createAwaitingResponseTextMessage, "sendTextMessage"
);
