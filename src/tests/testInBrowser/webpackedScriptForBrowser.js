/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../../../node_modules/createEnum/src/createEnum.js":
/***/ ((module) => {



const createEnum = function() {
  const out = Object.create(null);
  let countOfNames = arguments.length,
      name;

  for (;countOfNames;) {
    countOfNames -= 1;
    name = arguments[countOfNames];
    out[name] = countOfNames + 1;
  }
  return Object.freeze(out);
};

module.exports = createEnum;


/***/ }),

/***/ "../../Client/ResponsiveWebSocketClient.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const ResponsiveConnection = __webpack_require__("../../common/ResponsiveConnection/ResponsiveConnection.js");

const {
  binaryMessager: {
    createUnrequestingMessage: createUnrequestingBinaryMessage
  },
  textMessager: {
    createUnrequestingMessage: createUnrequestingTextMessage
  },
} = __webpack_require__("../../Client/modules/messaging/messaging.js");
const _emitEventByIncomingMessage = __webpack_require__("../../Client/methods/emitEventByIncomingMessage.js");

let W3CWebSocketClientClass = null;

const {
  _connection,
  _onClose
} = ResponsiveConnection._namesOfPrivateProperties;
const _onError = "_6";

const ResponsiveWebSocketClient = class extends ResponsiveConnection {
  constructor() {
    super();
  }

  setErrorListener(listenerOrNull) {
    this[_onError] = listenerOrNull;
  }

  connect(url) {
    return new Promise((resolve, reject) => {
      const client = this[_connection] = new W3CWebSocketClientClass(url);      
      client.binaryType = "arrayBuffer";
      
      const self = this;
      client.onopen = function onWebSocketLoad() {
        self._setupListenersOfEvents(client);
        client.onerror = _emitOnError.bind(this);
        resolve();
      };
      client.onerror = function onWebSocketFail(error) {
        _emitOnError.call(this, error);
        reject(error);
      };
    });
  }

  close(code, reason) {
    return this[_connection].close(code, reason);
  }

  // only in nodejs
  terminate() {
    return this[_connection].terminate();
  }

  _setupListenersOfEvents(webSocketClient) {
    webSocketClient.onerror = _emitOnError.bind(this);
    webSocketClient.onclose = _emitOnClose.bind(this);
    webSocketClient.onmessage = _emitEventByIncomingMessage.bind(this);
  }
};

ResponsiveWebSocketClient.setWebSocketClientClass = function setWebSocketClientClass(W3CWebSocket) {
  W3CWebSocketClientClass = W3CWebSocket;
};

const _emitOnError = function(error) {
  if (this[_onError]) {
    this[_onError](error);
  }
};

const _emitOnClose = function(event) {
  if (this[_onClose]) {
    this[_onClose](event);
  }
};

module.exports = ResponsiveWebSocketClient;

const Proto = ResponsiveWebSocketClient.prototype;

Proto.sendBinaryRequest = __webpack_require__("../../Client/methods/sendBinaryRequest.js");
Proto.sendTextRequest = __webpack_require__("../../Client/methods/sendTextRequest.js");

const createMethodToSendUnrequestingMessage = function(createUnrequestingMessage) {
  return function sendUnrequestingMessage(message) {
    return this[_connection].send(createUnrequestingMessage(message));
  };
};

Proto.sendUnrequestingBinaryMessage = createMethodToSendUnrequestingMessage(createUnrequestingBinaryMessage);
Proto.sendUnrequestingTextMessage = createMethodToSendUnrequestingMessage(createUnrequestingTextMessage);


/***/ }),

/***/ "../../Client/methods/emitEventByIncomingMessage.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const {
  textMessager: {
    extractTypeOfIncomingMessage: extractTypeOfIncomingTextMessage,
    extractIdOfMessage: extractIdOfTextMessage,
    startIndexOfBodyInUnrequestingMessage: startIndexOfBodyInUnrequestingTextMessage,
    startIndexOfBodyInRequest: startIndexOfBodyInTextRequest
  },
  binaryMessager: {
    extractTypeOfIncomingMessage: extractTypeOfIncomingBinaryMessage,
    extractIdOfMessage: extractIdOfBinaryMessage,
    startIndexOfBodyInUnrequestingMessage: startIndexOfBodyInUnrequestingBinaryMessage,
    startIndexOfBodyInRequest: startIndexOfBodyInBinaryRequest
  }
} = __webpack_require__("../../Client/modules/messaging/messaging.js");

const {
  binary: contentTypesOfMessages_binary,
  text: contentTypesOfMessages_text
} = (__webpack_require__("../../common/ResponsiveConnection/ResponsiveConnection.js").contentTypesOfMessages);

const listenEventOfMessageToInnerWebSocket = __webpack_require__(
  "../../common/ResponsiveConnection/utils/listenEventOfMessageToInnerWebSocket.js"
);
const SenderOfResponse = __webpack_require__("../../Client/modules/SenderOfResponse.js");

const {
  _connection,
  _idOfRequestToPromise,
  _onBinaryRequest,
  _onTextRequest,
  _onUnrequestingBinaryMessage,
  _onUnrequestingTextMessage,
} = (__webpack_require__("../../common/ResponsiveConnection/ResponsiveConnection.js")._namesOfPrivateProperties);

const emitEventByIncomingMessage = function(event) {
  return _emitOnFirstMessage.call(this, event);
};

const _emitOnFirstMessage = async function(event) {
  let data = event.data;
  if (typeof data === "string") {
    return _emitEventByIncomingTextMessage(this, data);
  }
  
  if (data instanceof ArrayBuffer) {
    this[_connection].onmessage = _emitOnMessageWithArrayBuffer.bind(this);
  } else {
    data = await data.arrayBuffer();
    this[_connection].onmessage = _emitOnMessageWithBlob.bind(this);
  }
  
  _emitEventByIncomingBinaryMessage(this, data);
};

const _emitOnMessageWithArrayBuffer = function(event) {
  const data = event.data;
  if (typeof data === "string") {
    return _emitEventByIncomingTextMessage(this, data);
  }
  _emitEventByIncomingBinaryMessage(this, data);
};

const _emitOnMessageWithBlob = async function(event) {
  const data = event.data;
  if (typeof data === "string") {
    return _emitEventByIncomingTextMessage(this, data);
  }
  const bytes = await data.arrayBuffer();
  _emitEventByIncomingBinaryMessage(this, data);
};

const _emitEventByIncomingBinaryMessage = function(responsiveConnection, message) {
  return listenEventOfMessageToInnerWebSocket(
    extractTypeOfIncomingBinaryMessage,
    extractIdOfBinaryMessage,
    contentTypesOfMessages_binary,
    
    _onUnrequestingBinaryMessage,
    startIndexOfBodyInUnrequestingBinaryMessage,
    
    _onBinaryRequest,
    startIndexOfBodyInBinaryRequest,
    SenderOfResponse,
  
    responsiveConnection,
    message
  );
};

const _emitEventByIncomingTextMessage = function(responsiveConnection, message) {
  return listenEventOfMessageToInnerWebSocket(
    extractTypeOfIncomingTextMessage,
    extractIdOfTextMessage,
    contentTypesOfMessages_text,
    
    _onUnrequestingTextMessage,
    startIndexOfBodyInUnrequestingTextMessage,
    
    _onTextRequest,
    startIndexOfBodyInTextRequest,
    SenderOfResponse,
  
    responsiveConnection,
    message
  );
};

module.exports = emitEventByIncomingMessage;


/***/ }),

/***/ "../../Client/methods/sendBinaryRequest.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const {_connection} = (__webpack_require__("../../common/ResponsiveConnection/ResponsiveConnection.js")._namesOfPrivateProperties);
const sendRequestByResponsiveConnection = __webpack_require__(
  "../../common/ResponsiveConnection/utils/sendRequestByResponsiveConnection.js"
);
const creatBinaryRequest = (__webpack_require__("../../Client/modules/messaging/messaging.js").binaryMessager.createRequestMessage);

const sendBinaryRequest = function(message, maxTimeMsToWaitResponse) {
  return sendRequestByResponsiveConnection(this, message, maxTimeMsToWaitResponse, sendMessageOfRequest);
};

const sendMessageOfRequest = function(responsiveConnection, idOfRequest, message) {
  return responsiveConnection[_connection].send(creatBinaryRequest(idOfRequest, message));
};

module.exports = sendBinaryRequest;


/***/ }),

/***/ "../../Client/methods/sendTextRequest.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const {_connection} = (__webpack_require__("../../common/ResponsiveConnection/ResponsiveConnection.js")._namesOfPrivateProperties);
const sendRequestByResponsiveConnection = __webpack_require__(
  "../../common/ResponsiveConnection/utils/sendRequestByResponsiveConnection.js"
);
const creatTextRequest = (__webpack_require__("../../Client/modules/messaging/messaging.js").textMessager.createRequestMessage);

const sendTextRequest = function(message, maxTimeMsToWaitResponse) {
  return sendRequestByResponsiveConnection(this, message, maxTimeMsToWaitResponse, sendMessageOfRequest);
};

const sendMessageOfRequest = function(responsiveConnection, idOfRequest, message) {
  return responsiveConnection[_connection].send(creatTextRequest(idOfRequest, message));
};

module.exports = sendTextRequest;


/***/ }),

/***/ "../../Client/modules/SenderOfResponse.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const createBinaryResponse = (__webpack_require__("../../Client/modules/messaging/messaging.js").binaryMessager.createResponseMessage);
const createTextResponse = (__webpack_require__("../../Client/modules/messaging/messaging.js").textMessager.createResponseMessage);

const SenderOfResponse = class {
  constructor(nonResponsiveWebSocketConnection, idOfMessage) {
    this[_nonResponsiveWebSocketConnection] = nonResponsiveWebSocketConnection;
    this[_idOfMessage] = idOfMessage;
  }

  sendBinaryResponse(message) {
    return this[_nonResponsiveWebSocketConnection].send(createBinaryResponse(this[_idOfMessage], message));
  }

  sendTextResponse(message) {
    return this[_nonResponsiveWebSocketConnection].send(createTextResponse(this[_idOfMessage], message));
  }
};

const _nonResponsiveWebSocketConnection = "_",
      _idOfMessage = "_i";

module.exports = SenderOfResponse;


/***/ }),

/***/ "../../Client/modules/messaging/messagers/binaryMessager/binaryMessager.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const insertArrayBufferToAnotherUnsafe = __webpack_require__("../../Client/modules/messaging/messagers/binaryMessager/insertArrayBufferToAnotherUnsafe.js");
const abstractMessager = __webpack_require__("../../common/messaging/binaryMessages/abstractMessager.js");

const {
  request: byteOfHeaders_request,
  response: byteOfHeaders_response,
  unrequestingMessage: byteOfHeaders_unrequestingMessage
} = __webpack_require__("../../common/messaging/binaryMessages/byteHeaders.js");

const createFnToSendMessageWithId = function(header8Bits) {
  return function binaryMessageCreator(idOfMessage16Bits, payload) {
    // const countOfBytesInHeader = 3
    const totalByteLength = 3 + payload.byteLength,
          message = new ArrayBuffer(totalByteLength),
          dataView = new DataView(message);
    
    dataView.setUint8(0, header8Bits);
    dataView.setUint16(1, idOfMessage16Bits);

    const startIndexOfPayload = 3;
    insertArrayBufferToAnotherUnsafe(message, startIndexOfPayload, payload);
    return message;
  };
};

const binaryMessager = abstractMessager;

binaryMessager.createUnrequestingMessage = function(payload) {
  const totalByteLength = 1 + payload.byteLength,
        message = new ArrayBuffer(totalByteLength),
        bytes = new Uint8Array(message);

  bytes[0] = byteOfHeaders_unrequestingMessage;

  const startIndexOfPayload = 1;
  insertArrayBufferToAnotherUnsafe(message, startIndexOfPayload, payload);
  return message;
};

binaryMessager.createRequestMessage = createFnToSendMessageWithId(byteOfHeaders_request);
binaryMessager.createResponseMessage = createFnToSendMessageWithId(byteOfHeaders_response);

module.exports = binaryMessager;


/***/ }),

/***/ "../../Client/modules/messaging/messagers/binaryMessager/insertArrayBufferToAnotherUnsafe.js":
/***/ ((module) => {



const insertArrayBufferToAnotherUnsafe = function(
  sourceArrayBuffer, startIndexInSource, insertedArrayBuffer
) {
  const sourceBytes = new Uint8Array(sourceArrayBuffer),
        insertedBytes = new Uint8Array(insertedArrayBuffer),
        countOfInsertedBytes = insertedBytes.length,
        afterLastIndex = startIndexInSource + countOfInsertedBytes - 1;

  let indexInSource = startIndexInSource,
      indexInInserted = 0;
  for (; indexInInserted < countOfInsertedBytes;) {
    sourceBytes[indexInSource] = insertedBytes[indexInInserted];
    indexInSource += 1;
    indexInInserted += 1;
  }
};

module.exports = insertArrayBufferToAnotherUnsafe;


/***/ }),

/***/ "../../Client/modules/messaging/messagers/textMessager/textMessager.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const abstractMessager = __webpack_require__("../../common/messaging/textMessages/abstractMessager.js");

const {
  uInt16ToCharPlus2Chars8BitString
} = __webpack_require__("../../common/messaging/textMessages/uInt16ViewIn2Char/uInt16ViewIn2Char.js");

const {
  request: charCodesOfHeaders_request,
  response: charCodesOfHeaders_response,
  unrequestingMessage: charCodesOfHeaders_unrequestingMessage
} = __webpack_require__("../../common/messaging/textMessages/charCodesOfHeaders.js");

const header_unrequestingMessage = String.fromCharCode(
  charCodesOfHeaders_unrequestingMessage);

const textMessager = abstractMessager;

textMessager.createRequestMessage = function(idOfRequest, text) {
  return uInt16ToCharPlus2Chars8BitString(charCodesOfHeaders_request, idOfRequest) + text;
};
textMessager.createUnrequestingMessage = function(text) {
  return header_unrequestingMessage + text;
};
textMessager.createResponseMessage = function(idOfMessage, text) {
  return uInt16ToCharPlus2Chars8BitString(charCodesOfHeaders_response, idOfMessage) + text;
};

module.exports = textMessager;


/***/ }),

/***/ "../../Client/modules/messaging/messaging.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



module.exports = {
  binaryMessager: __webpack_require__("../../Client/modules/messaging/messagers/binaryMessager/binaryMessager.js"),
  textMessager: __webpack_require__("../../Client/modules/messaging/messagers/textMessager/textMessager.js")
};


/***/ }),

/***/ "../../common/ResponsiveConnection/ResponsiveConnection.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const createEnum = __webpack_require__("../../../node_modules/createEnum/src/createEnum.js");
const contentTypesOfMessages = createEnum("binary", "text");

const GeneratorOfRequestId = __webpack_require__("../../common/ResponsiveConnection/utils/SequenceGeneratorOfUint16/SequenceGeneratorOfUint16.js");

const startIndexOfBodyInBinaryResponse = (__webpack_require__("../../common/messaging/textMessages/abstractMessager.js").startIndexOfBodyInResponse);

const startIndexOfBodyInTextResponse = (__webpack_require__("../../common/messaging/binaryMessages/abstractMessager.js").startIndexOfBodyInResponse);

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


/***/ }),

/***/ "../../common/ResponsiveConnection/utils/SequenceGeneratorOfUint16/SequenceGeneratorOfUint16.js":
/***/ ((module) => {



const SequenceGeneratorOfUint16 = class {
  constructor() {
    this[_numbers] = new Uint16Array(1);
  }

  getNext() {
    return this[_numbers][0]++; //not this[_numbers][0] += 1
  }
};

const _numbers = "_";

module.exports = SequenceGeneratorOfUint16;


/***/ }),

/***/ "../../common/ResponsiveConnection/utils/createTimeoutToReceiveResponse.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const { TimeoutToReceiveResponseException } = __webpack_require__("../../common/ResponsiveConnection/ResponsiveConnection.js");

const createTimeoutToReceiveResponse = function(
  idOfRequestToEntryAboutPromise,
  idOfMessage,
  rejectPromise,
  maxTimeMsToWaitResponse
) {
  return setTimeout(
    _deleteEntryAndRejectResponsePromise,
    maxTimeMsToWaitResponse,
    idOfRequestToEntryAboutPromise,
    idOfMessage,
    rejectPromise
  );
};

const _deleteEntryAndRejectResponsePromise = function(idOfRequestToEntryAboutPromise, idOfMessage, rejectPromise) {
  idOfRequestToEntryAboutPromise.delete(idOfMessage);
  rejectPromise(new TimeoutToReceiveResponseException(
    "ResponsiveWebSocketConnection:: timeout for receiving response."));
};

module.exports = createTimeoutToReceiveResponse;


/***/ }),

/***/ "../../common/ResponsiveConnection/utils/entryAboutPromiseOfRequest.js":
/***/ ((module) => {



const create = function(resolvePromise, timeoutToWait) {
  return {
    a: resolvePromise,
    b: timeoutToWait
  };
};

const nameOfPromiseResolver = "a",
      nameOfTimeout = "b";

module.exports = {
  create,
  nameOfPromiseResolver,
  nameOfTimeout
};


/***/ }),

/***/ "../../common/ResponsiveConnection/utils/listenEventOfMessageToInnerWebSocket.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const {
  request: typesOfIncomingMessages_request,
  response: typesOfIncomingMessages_response,
  unrequestingMessage: typesOfIncomingMessages_unrequestingMessage,
} = __webpack_require__("../../common/messaging/typesOfIncomingMessages.js");

const ExceptionAtParsing = __webpack_require__("../../common/messaging/ExceptionAtParsing.js");

const {
  _connection,
  _idOfRequestToPromise
} = (__webpack_require__("../../common/ResponsiveConnection/ResponsiveConnection.js")._namesOfPrivateProperties);

const {
  create: entryAboutPromiseOfRequest_create,
  nameOfPromiseResolver: entryAboutPromiseOfRequest_nameOfPromiseResolver,
  nameOfTimeout: entryAboutPromiseOfRequest_nameOfTimeout
} = __webpack_require__("../../common/ResponsiveConnection/utils/entryAboutPromiseOfRequest.js");

const listenEventOfMessageToInnerWebSocket = function(
  extractTypeOfIncomingMessage,
  extractIdOfMessage,
  typeOfMessageContent,
  
  nameOfUnrequestingMessageEventListener,
  startIndexOfBodyInUnrequestingMessage,
  
  nameOfRequestEventListener,
  startIndexOfBodyInRequest,
  SenderOfResponse,

  responsiveWebSocket,
  incomingMessage
) {
  let typeOfMessage;
  try {
    typeOfMessage = extractTypeOfIncomingMessage(incomingMessage);
  } catch(error) {
    if (error instanceof ExceptionAtParsing) {
      return;
    }
    throw error;
  }
  
  if (typeOfMessage === typesOfIncomingMessages_response) {
    return _resolveAwaitingResponseMessagePromise(
      extractIdOfMessage,
      typeOfMessageContent,
      responsiveWebSocket,
      incomingMessage
    );  
  }
  else if (typeOfMessage === typesOfIncomingMessages_unrequestingMessage) {
    return _emitUnrequestingMessageEvent(
      nameOfUnrequestingMessageEventListener,
      startIndexOfBodyInUnrequestingMessage,
      responsiveWebSocket,
      incomingMessage
    );
  }
  else if (typeOfMessage === typesOfIncomingMessages_request) {
    return _emitAwaitingResponseMessageEvent(
      extractIdOfMessage,
      nameOfRequestEventListener,
      SenderOfResponse,
      startIndexOfBodyInRequest,
      responsiveWebSocket,
      incomingMessage
    ); 
  }
};

const _resolveAwaitingResponseMessagePromise = function(
  extractIdOfMessage,
  typeOfMessageContent,
  responsiveWebSocket,
  rawPayload
) {
  const table = responsiveWebSocket[_idOfRequestToPromise],
        numOfMessage = extractIdOfMessage(rawPayload),
        awaitingPromise = table.get(numOfMessage);
  
  if (awaitingPromise) {
    clearTimeout(awaitingPromise[entryAboutPromiseOfRequest_nameOfTimeout]);
    const dataForCallback = {
      contentType: typeOfMessageContent,
      message: rawPayload
    };

    table.delete(numOfMessage);
    awaitingPromise[entryAboutPromiseOfRequest_nameOfPromiseResolver](dataForCallback);
  }
};

const _emitUnrequestingMessageEvent = function(
  nameOfUnrequestingMessageEventListener,
  startIndexOfBodyInUnrequestingMessage,
  responsiveWebSocket,
  rawPayload
) {
  if (responsiveWebSocket[nameOfUnrequestingMessageEventListener]) {
    responsiveWebSocket[nameOfUnrequestingMessageEventListener](rawPayload, startIndexOfBodyInUnrequestingMessage);
  }
};

const _emitAwaitingResponseMessageEvent = function(
  extractIdOfMessage,
  nameOfRequestEventListener,
  SenderOfResponse,
  startIndexOfBodyInRequest,
  responsiveWebSocket,
  rawPayload
) {
  if (responsiveWebSocket[nameOfRequestEventListener]) {
    const numOfMessage = extractIdOfMessage(rawPayload);
    const senderOfResponse = new SenderOfResponse(responsiveWebSocket[_connection], numOfMessage);
    
    responsiveWebSocket[nameOfRequestEventListener](
      rawPayload,
      startIndexOfBodyInRequest,
      senderOfResponse
    );
  }
};

module.exports = listenEventOfMessageToInnerWebSocket;


/***/ }),

/***/ "../../common/ResponsiveConnection/utils/sendRequestByResponsiveConnection.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const {
  _connection,
  _generatorOfRequestId,
  _idOfRequestToPromise,
  _maxTimeMsToWaitResponse,
} = (__webpack_require__("../../common/ResponsiveConnection/ResponsiveConnection.js")._namesOfPrivateProperties);

const createTimeoutToReceiveResponse = __webpack_require__("../../common/ResponsiveConnection/utils/createTimeoutToReceiveResponse.js");
const createEntryAboutPromiseOfRequest = (__webpack_require__("../../common/ResponsiveConnection/utils/entryAboutPromiseOfRequest.js").create);

const sendRequestByResponsiveConnection = function(
  responsiveConnection,
  message,
  maxTimeMsToWaitResponse,
  sendMessageOfRequest
) {
  return new Promise(function(resolve, reject) {
    if (!maxTimeMsToWaitResponse) {
      maxTimeMsToWaitResponse = responsiveConnection[_maxTimeMsToWaitResponse];
    }
    const idOfRequest = responsiveConnection[_generatorOfRequestId].getNext();
    const idOfRequestToPromise = responsiveConnection[_idOfRequestToPromise];
    const timeout = createTimeoutToReceiveResponse(
      idOfRequestToPromise,
      idOfRequest,
      reject,
      maxTimeMsToWaitResponse
    );
    const entryAboutPromise = createEntryAboutPromiseOfRequest(resolve, timeout);
    idOfRequestToPromise.set(idOfRequest, entryAboutPromise);
    sendMessageOfRequest(responsiveConnection, idOfRequest, message);
  });
};

module.exports = sendRequestByResponsiveConnection;


/***/ }),

/***/ "../../common/messaging/ExceptionAtParsing.js":
/***/ ((module) => {



const ExceptionAtParsing = class extends Error {};

module.exports = ExceptionAtParsing;


/***/ }),

/***/ "../../common/messaging/binaryMessages/abstractMessager.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const {
  response: typeOfIncomingMessage_response,
  request: typeOfIncomingMessage_request,
  unrequestingMessage: typeOfIncomingMessage_unrequestingMessage
} = __webpack_require__("../../common/messaging/typesOfIncomingMessages.js");

const ExceptionAtParsing = __webpack_require__("../../common/messaging/ExceptionAtParsing.js");

const {
  request: byteOfHeaders_request,
  response: byteOfHeaders_response,
  unrequestingMessage: byteOfHeaders_unrequestingMessage
} = __webpack_require__("../../common/messaging/binaryMessages/byteHeaders.js");

const abstractMessager = {
  extractTypeOfIncomingMessage(message) {
    const header1stByte = new DataView(message).getUint8(0);

    switch (header1stByte) {
      case byteOfHeaders_response:
        return typeOfIncomingMessage_response;
      case byteOfHeaders_unrequestingMessage:
        return typeOfIncomingMessage_unrequestingMessage;
      case byteOfHeaders_request:
        return typeOfIncomingMessage_request;
    }
    throw new ExceptionAtParsing("Message of unrecognized type.");
  },
  extractIdOfMessage(awaitingResponseOrResponseMessage) {
    return new DataView(awaitingResponseOrResponseMessage).getUint16(1);
  },

  startIndexOfBodyInRequest: 3,
  startIndexOfBodyInUnrequestingMessage: 1,
  startIndexOfBodyInResponse: 3
};

module.exports = abstractMessager;


/***/ }),

/***/ "../../common/messaging/binaryMessages/byteHeaders.js":
/***/ ((module) => {



const byteHeaders = {
  request: 1,
  response: 2,
  unrequestingMessage: 3
};

module.exports = byteHeaders;


/***/ }),

/***/ "../../common/messaging/textMessages/abstractMessager.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const {
  request: typeOfIncomingMessage_request,
  unrequestingMessage: typeOfIncomingMessage_unrequestingMessage,
  response: typeOfIncomingMessage_response
} = __webpack_require__("../../common/messaging/typesOfIncomingMessages.js");

const ExceptionAtParsing = __webpack_require__("../../common/messaging/ExceptionAtParsing.js");

const {
  request: charCodesOfHeaders_request,
  response: charCodesOfHeaders_response,
  unrequestingMessage: charCodesOfHeaders_unrequestingMessage
} = __webpack_require__("../../common/messaging/textMessages/charCodesOfHeaders.js");

const { extractUInt16FromStringUnsafe } = __webpack_require__("../../common/messaging/textMessages/uInt16ViewIn2Char/uInt16ViewIn2Char.js");

const abstractMessager = {
  extractTypeOfIncomingMessage(message) {
    const charCodeOfHeader = message.charCodeAt(0);
    
    switch (charCodeOfHeader) {
      case charCodesOfHeaders_request:
        return typeOfIncomingMessage_request;
      case charCodesOfHeaders_unrequestingMessage:
        return typeOfIncomingMessage_unrequestingMessage;
      case charCodesOfHeaders_response:
        return typeOfIncomingMessage_response;
    }
    throw new ExceptionAtParsing("Message of unrecognized type.");
  },
  extractIdOfMessage(awaitingResponseMessageOrResponse) {
    const minLengthOfMessage = 3;
    const message = awaitingResponseMessageOrResponse;
    if (message.length < minLengthOfMessage) {
      throw new ExceptionAtParsing("Message is too short");
    }
    const startIndex = 1;
    return extractUInt16FromStringUnsafe(startIndex, message);
  },
  startIndexOfBodyInRequest: 3,
  startIndexOfBodyInUnrequestingMessage: 1,
  startIndexOfBodyInResponse: 3
};

module.exports = abstractMessager;


/***/ }),

/***/ "../../common/messaging/textMessages/charCodesOfHeaders.js":
/***/ ((module) => {



const charCodesOfHeaders = {
  request: 1,
  response: 2,
  unrequestingMessage: 3
};

module.exports = charCodesOfHeaders;


/***/ }),

/***/ "../../common/messaging/textMessages/uInt16ViewIn2Char/uInt16ViewIn2Char.js":
/***/ ((module) => {



const stringFromCharCodes = String.fromCharCode;

const uInt16ToCharPlus2Chars8BitString = function(codeOfHeaderSymbol, uInt16) {
  const bytes = new Uint16Array([uInt16]).buffer;
  const uInt8s = new Uint8Array(bytes),
        firstByte = uInt8s[0],
        secondByte = uInt8s[1];
  return stringFromCharCodes(codeOfHeaderSymbol, firstByte, secondByte);
};

const extractUInt16FromStringUnsafe = function(startIndex, stringWithEnoughLength) {
  const indexOfSecondByte = startIndex + 1;
  const firstCharCode = stringWithEnoughLength.charCodeAt(startIndex),
        secondCharCode = stringWithEnoughLength.charCodeAt(indexOfSecondByte),
        bytes = new Uint8Array([firstCharCode, secondCharCode]).buffer;
  
  const out = new Uint16Array(bytes)[0];
  return out;
};

module.exports = {
  uInt16ToCharPlus2Chars8BitString,
  extractUInt16FromStringUnsafe
};


/***/ }),

/***/ "../../common/messaging/typesOfIncomingMessages.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const createEnum = __webpack_require__("../../../node_modules/createEnum/src/createEnum.js");

module.exports = createEnum(
  "request",
  "unrequestingMessage",
  "response"
);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/* harmony import */ var _Client_ResponsiveWebSocketClient_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../Client/ResponsiveWebSocketClient.js");
/* harmony import */ var _Client_ResponsiveWebSocketClient_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Client_ResponsiveWebSocketClient_js__WEBPACK_IMPORTED_MODULE_0__);




_Client_ResponsiveWebSocketClient_js__WEBPACK_IMPORTED_MODULE_0___default().setWebSocketClientClass(window.WebSocket);

(async function() {
  const client = new (_Client_ResponsiveWebSocketClient_js__WEBPACK_IMPORTED_MODULE_0___default())(),
        port = 4443,
        url = "ws://127.0.0.1:" + port + "/wsAPI/awjoiadwj";

  await client.connect(url);

  const sendTextAndReceiveResponse = async function(client, sendedText) {
    const startIndex = client.startIndexOfBodyInTextResponse;
    const {message} = await client.sendTextRequest(sendedText);
    return message.slice(startIndex);
  };

  const sendInt32AndReceiveInt32 = async function(client, sendedInt32) {
    const message = new ArrayBuffer(4);
    let dataView = new DataView(message);
    dataView.setInt32(0, sendedInt32);

    const {message: response} = await client.sendBinaryRequest(message);
    dataView = new DataView(response);
    const startIndex = client.startIndexOfBodyInBinaryResponse;
    return dataView.getInt32(startIndex);
  };

  const [textResponse, int32Response] = await Promise.all([
    sendTextAndReceiveResponse(client, "Lorem Ipsum"),
    sendInt32AndReceiveInt32(client, 123456)
  ]);

  const expectEqual = function(a, b) {
    if (a !== b) {
      throw new Error("" + a + " !== " + b);
    }
  };

  expectEqual(textResponse, "Lorem Ipsum".toUpperCase());
  expectEqual(int32Response, 123456 * 4);

  console.log("Ok");
})();

})();

/******/ })()
;