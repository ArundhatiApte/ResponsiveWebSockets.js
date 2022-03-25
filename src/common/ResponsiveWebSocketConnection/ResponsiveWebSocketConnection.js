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
const _defaultMaxTimeMsToWaitResponse = 4000;
const TimeoutToReceiveResponseException = class extends Error {};

const ResponsiveWebSocketConnection = class {
  constructor(nonResponsiveConnection) {
    this[_connection] = nonResponsiveConnection;
    this[_maxTimeMsToWaitResponse] = _defaultMaxTimeMsToWaitResponse;
    this[_genOfAwaitingResponseMessageId] = new MessageIdGen();
    this[_idOfAwaitingResponseMessageToPromise] = new Map();
    
    this[_onAwaitingResponseBinaryMessage] = null;
    this[_onUnrequestingBinaryMessage] = null;
    this[_onAwaitingResponseTextMessage] = null;
    this[_onUnrequestingTextMessage] = null;

    this._setupOnMessageListeners();
  }

  static contentTypesOfMessages = messageContentTypes;
  static TimeoutToReceiveResponseException = TimeoutToReceiveResponseException;
  
  get startIndexOfBodyInBinaryResponse() {
    return startIndexOfBodyInBinaryResponse;
  }
  
  get startIndexOfBodyInTextResponse() {
    return startIndexOfBodyInTextResponse;
  }
  
  set maxTimeMsToWaitResponse(ms) {
    this[_maxTimeMsToWaitResponse] = ms;
  }
  
  get maxTimeMsToWaitResponse() {
    return this[_maxTimeMsToWaitResponse];
  }

  get url() {
    return this[_connection].url;
  }

  close(code, reason) {
    return this[_connection].close(code, reason);
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
    
    let listener = _emitEventByIncomingBinaryMessage.bind(this);
    connection.onBinaryMessage = listener;

    listener = _emitEventByIncomingTextMessage.bind(this);
    connection.onTextMessage = listener;
  }

  setBinaryRequestListener(listener) {
    this[_onAwaitingResponseBinaryMessage] = listener;
  }

  setTextRequestListener(listener) {
    this[_onAwaitingResponseTextMessage] = listener;
  }
};

const _connection = "_c",
      _maxTimeMsToWaitResponse = "_m",
      _genOfAwaitingResponseMessageId = "_g",
      _idOfAwaitingResponseMessageToPromise = "_t",
      
      _onAwaitingResponseBinaryMessage = "_1",
      _onUnrequestingBinaryMessage = "_2",
      _onAwaitingResponseTextMessage = "_3",
      _onUnrequestingTextMessage = "_4",
      
      Proto = ResponsiveWebSocketConnection.prototype;

module.exports = ResponsiveWebSocketConnection;

ResponsiveWebSocketConnection._namesOfPrivateProperties = {
  _connection,
  _maxTimeMsToWaitResponse,
  _genOfAwaitingResponseMessageId,
  _idOfAwaitingResponseMessageToPromise,
  
  _onAwaitingResponseBinaryMessage,
  _onUnrequestingBinaryMessage,
  _onAwaitingResponseTextMessage,
  _onUnrequestingTextMessage
};

const createMethodToSetupOnMessageListenerOfInnerWebSocket =
  require("./creatingMethods/createMethodToSetupOnMessageListenerOfInnerWebSocket");

const _emitEventByIncomingBinaryMessage = createMethodToSetupOnMessageListenerOfInnerWebSocket(
  binaryMessager.extractTypeOfIncomingMessage,
  binaryMessager.extractIdOfMessage,
  
  messageContentTypes.binary,
  _onUnrequestingBinaryMessage,
  binaryMessager.startIndexOfUnrequestingMessageBody,
  _onAwaitingResponseBinaryMessage,
  binaryMessager.startIndexOfAwaitingResponseMessageBody
);

const _emitEventByIncomingTextMessage = createMethodToSetupOnMessageListenerOfInnerWebSocket(
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

Proto.sendBinaryRequest = createMethodToSendAwaitingResponseMessage(
  binaryMessager.createAwaitingResponseBinaryMessage, "sendBinaryMessage"
);
Proto.sendTextRequest = createMethodToSendAwaitingResponseMessage(
  textMessager.createAwaitingResponseTextMessage, "sendTextMessage"
);
