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

/***/ "../../ResponsiveWebSocketClient/ResponsiveWebSocketClient.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const WebSocketClient = __webpack_require__("../../ResponsiveWebSocketClient/modules/WebSocketClient.js"),
      ResponsiveWebSoket = __webpack_require__("../../common/ResponsiveWebSocketConnection/ResponsiveWebSocketConnection.js");
      
const {_connection} = ResponsiveWebSoket._namesOfPrivateProperties;

const ResponsiveWebSocketClient = class extends ResponsiveWebSoket {
  constructor(webSocketClient) {
    super(webSocketClient || new WebSocketClient());
    this._setupOnLoadListener();
  }

  setLoadListener(listener) {
    this[_onLoad] = listener;
  }
    
  _setupOnLoadListener() {
    this[_connection].onLoad = () => {
      this[_connection].onLoad = null;
      if (this[_onLoad]) {
        this[_onLoad]();
      }
    };
  }
  
  connect(url) {
    return this[_connection].connect(url);
  }
  
  close(code, reason) {
    return this[_connection].close(code, reason);
  }

  terminate() {
    return this[_connection].terminate();
  }
};

const _onLoad = "_77";

ResponsiveWebSocketClient.setWebSocketClientClass = WebSocketClient.setWebSocketClientClass;

module.exports = ResponsiveWebSocketClient;


/***/ }),

/***/ "../../ResponsiveWebSocketClient/modules/WebSocketClient.js":
/***/ ((module) => {



let W3CWebSocketClientClass;

const WebSocketClient = class {
  constructor() {
    this.onLoad = this.onError = this.onClose = null;
    this[_onBinaryMessage] = this[_onTextMessage] = null;
  }

  set onBinaryMessage(listener) {
    this[_onBinaryMessage] = listener;
  }

  get onBinaryMessage() {
    return this[_onBinaryMessage];
  }

  set onTextMessage(listener) {
    this[_onTextMessage] = listener;
  }

  get onTextMessage() {
    return this[_onTextMessage];
  }
  
  connect(url) {
    return new Promise((resolve, reject) => {
      const client = this[_webSocketClient] = new W3CWebSocketClientClass(url);      
      client.binaryType = "arrayBuffer";
      
      const self = this;
      client.onopen = function onWebSocketLoad() {
        self._setupListenersOfEvents();
        self._emitOnLoad();
        resolve();
      };
      client.onerror = function onWebSocketFail(error) {
        self._emitOnError(error);
        reject(error);
      };
    });
  }
  
  _setupListenersOfEvents() {
    const webSocket = this[_webSocketClient];
    webSocket.onmessage = _emitOnFirstMessage.bind(this);
    webSocket.onclose = this._emitOnClose.bind(this);
    webSocket.onerror = this._emitOnError.bind(this);
  }
  
  close(code, reason) {
    return this[_webSocketClient].close(code, reason);
  }
};

const _webSocketClient = "_",
      _onBinaryMessage = "_2",
      _onTextMessage = "_3",
      _onError = "_4",
      Proto = WebSocketClient.prototype;

Proto.sendBinaryMessage = Proto.sendTextMessage = function sendMessage(message) {
  return this[_webSocketClient].send(message);
};

const _emitOnFirstMessage = (function() {
  
  const _emitOnMessageWithArrayBuffer = function(event) {
    const {data} = event;
    if (typeof data === "string") {
      this[_onTextMessage](data);
      return;
    }
    this[_onBinaryMessage](data);
  };
  
  const _emitOnMessageWithBlob = async function(event) {
    const {data} = event;
    if (typeof data === "string") {
      this[_onTextMessage](data);
      return;
    }
    const bytes = await data.arrayBuffer();
    this[_onBinaryMessage](bytes);
  };
  
  const _emitOnFirstMessage = async function(event) {
    let data = event.data;
    if (typeof data === "string") {
      this[_onTextMessage](data);
      return;
    }
    
    if (data instanceof ArrayBuffer) {
      this[_webSocketClient].onmessage = _emitOnMessageWithArrayBuffer.bind(this);
    } else {
      data = await data.arrayBuffer();
      this[_webSocketClient].onmessage = _emitOnMessageWithBlob.bind(this);
    }
    
    this[_onBinaryMessage](data);
  };
  
  return _emitOnFirstMessage;
})();
      
const _createMethodToEmitEvent = function(nameOfEventProperty) {
  return function() {
    const listener = this[nameOfEventProperty];
    if (listener) {
      listener.apply(this, arguments);
    }
  };
};

Proto._emitOnLoad = _createMethodToEmitEvent("onLoad");
Proto._emitOnError = _createMethodToEmitEvent("onError");
Proto._emitOnClose = _createMethodToEmitEvent("onClose");
      
WebSocketClient.setWebSocketClientClass = function(WebSocketClient) {
  W3CWebSocketClientClass = WebSocketClient;
};

module.exports = WebSocketClient;


/***/ }),

/***/ "../../common/ResponsiveWebSocketConnection/ResponsiveWebSocketConnection.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const createEnum = __webpack_require__("../../../node_modules/createEnum/src/createEnum.js");

const {
  binaryMessager,
  textMessager
} = __webpack_require__("../../common/ResponsiveWebSocketConnection/modules/messaging/messaging.js");

const startIndexOfBodyInTextResponse = textMessager.startIndexOfResponseMessageBody;
const startIndexOfBodyInBinaryResponse = binaryMessager.startIndexOfResponseMessageBody;

const MessageIdGen = __webpack_require__(
  "../../common/ResponsiveWebSocketConnection/modules/createClassOfGeneratorOfSequenceIntegers/createClassOfGeneratorOfSequenceIntegers.js"
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
  __webpack_require__("../../common/ResponsiveWebSocketConnection/creatingMethods/createMethodToSetupOnMessageListenerOfInnerWebSocket.js");

Proto._emitEventByIncomingBinaryMessage = createMethodToSetupOnMessageListenerOfInnerWebSocket(
  binaryMessager.parseBinaryMessage,
  messageContentTypes.binary,
  _onUnrequestingBinaryMessage,
  binaryMessager.startIndexOfUnrequestingMessageBody,
  _onAwaitingResponseBinaryMessage,
  binaryMessager.startIndexOfAwaitingResponseMessageBody
);

Proto._emitEventByIncomingTextMessage = createMethodToSetupOnMessageListenerOfInnerWebSocket(
  textMessager.parseTextMessage,
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
  __webpack_require__("../../common/ResponsiveWebSocketConnection/creatingMethods/createMethodToSendAwaitingResponseMessage.js");

Proto.sendAwaitingResponseBinaryMessage = Proto.sendBinaryRequest = createMethodToSendAwaitingResponseMessage(
  binaryMessager.createAwaitingResponseBinaryMessage, "sendBinaryMessage"
);
Proto.sendAwaitingResponseTextMessage = Proto.sendTextRequest = createMethodToSendAwaitingResponseMessage(
  textMessager.createAwaitingResponseTextMessage, "sendTextMessage"
);


/***/ }),

/***/ "../../common/ResponsiveWebSocketConnection/creatingMethods/createMethodToSendAwaitingResponseMessage.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const {
  TimeoutToReceiveResponseExeption,
  _namesOfPrivateProperties: {
    _maxTimeMSToWaitResponse,
    _genOfAwaitingResponseMessageId,
    _idOfAwaitingResponseMessageToPromise,
    _connection
  }
} = __webpack_require__("../../common/ResponsiveWebSocketConnection/ResponsiveWebSocketConnection.js");

const {
  create: entryAboutPromiseOfRequest_create
} = __webpack_require__("../../common/ResponsiveWebSocketConnection/creatingMethods/entryAboutPromiseOfRequest.js");

const createMethodToSendAwaitingResponseMessage = function(
  createAwaitingResponseMessage, nameOfSendingMessageMethod
) {
  return function sendAwaitingResponseMessage(message, maxTimeMSToWaitResponse) {
    return new Promise((resolve, reject) => {
      if (!maxTimeMSToWaitResponse) {
        maxTimeMSToWaitResponse = this[_maxTimeMSToWaitResponse];
      }
      const idOfMessage = this[_genOfAwaitingResponseMessageId].getNext();
      const timeoutToReject = _createTimeoutToReceiveResponse(
        this, idOfMessage, reject, maxTimeMSToWaitResponse
      );
      
      const entryAboutPromise = entryAboutPromiseOfRequest_create(resolve, timeoutToReject);
      this[_idOfAwaitingResponseMessageToPromise].set(idOfMessage, entryAboutPromise);
      const messageWithHeader = createAwaitingResponseMessage(idOfMessage, message);
      this[_connection][nameOfSendingMessageMethod](messageWithHeader);
    });
  };
};

const _createTimeoutToReceiveResponse = function(
  responsiveConnection,
  idOfMessage,
  rejectPromise,
  maxTimeMSToWaitResponse
) {
  return setTimeout(
    _rejectMessageResponsePromiseAndDeleteEntry.bind(responsiveConnection, rejectPromise, idOfMessage),
    maxTimeMSToWaitResponse
  );
};

const _rejectMessageResponsePromiseAndDeleteEntry = function(rejectPromise, idOfMessage) {
  this[_idOfAwaitingResponseMessageToPromise].delete(idOfMessage);
  rejectPromise(new TimeoutToReceiveResponseExeption(
    "ResponsiveWebSocketConnection:: timeout for receiving response."));
};

module.exports = createMethodToSendAwaitingResponseMessage;


/***/ }),

/***/ "../../common/ResponsiveWebSocketConnection/creatingMethods/createMethodToSetupOnMessageListenerOfInnerWebSocket.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const {
  response: typesOfIncomingMessages_response,
  incomingWithoutWaitingResponse: typesOfIncomingMessages_incomingWithoutWaitingResponse,
  incomingAwaitingResponse: typesOfIncomingMessages_incomingAwaitingResponse 
} = (__webpack_require__("../../common/ResponsiveWebSocketConnection/modules/messaging/messaging.js").typesOfIncomingMessages);

const SenderOfResponse = __webpack_require__("../../common/ResponsiveWebSocketConnection/modules/SenderOfResponse.js");

const {
  _connection,
  _idOfAwaitingResponseMessageToPromise
} = (__webpack_require__("../../common/ResponsiveWebSocketConnection/ResponsiveWebSocketConnection.js")._namesOfPrivateProperties);

const {
  nameOfTimeout: entryAboutPromiseOfRequest_nameOfTimeout,
  nameOfPromiseResolver: entryAboutPromiseOfRequest_nameOfPromiseResolver
} = __webpack_require__("../../common/ResponsiveWebSocketConnection/creatingMethods/entryAboutPromiseOfRequest.js");

const createMethodToSetupOnMessageListenerOfInnerWebSocket = function(
  parseMessage,
  typeOfMessageContent,
  
  nameOfUnrequestingMessageEventListener,
  startIndexOfUnrequestingMessageBody,
  
  nameOfAwaitingResponseMessageEventListener,
  startIndexOfAwaitingResponseMessageBody
) {

  const _emitEventByIncomingMessage = function(message) {
    let infoAboutMessage;
    try {
      infoAboutMessage = parseMessage(message);
    } catch(error) {
      if (error instanceof ExeptionAtParsing) {
        return;
      }
      throw error;
    }
    const type = infoAboutMessage.type;
    
    if (type === typesOfIncomingMessages_response) {
      return _resolveAwaitingResponseMessagePromise.call(this, infoAboutMessage, message);  
    }
    else if (type === typesOfIncomingMessages_incomingWithoutWaitingResponse) {
      return _emitUnrequestingMessageEvent.call(this, infoAboutMessage, message);
    }
    else if (type === typesOfIncomingMessages_incomingAwaitingResponse) {
      return _emitAwaitingResponseMessageEvent.call(this, infoAboutMessage, message); 
    }
  };

  const _resolveAwaitingResponseMessagePromise = function(infoAboutMessage, rawPayload) {
    const table = this[_idOfAwaitingResponseMessageToPromise],
          numOfMessage = infoAboutMessage.idOfMessage,
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

  const _emitUnrequestingMessageEvent = function(infoAboutMessage, rawPayload) {
    if (this[nameOfUnrequestingMessageEventListener]) {
      this[nameOfUnrequestingMessageEventListener](rawPayload, startIndexOfUnrequestingMessageBody);
    }
  };
  
  const _emitAwaitingResponseMessageEvent = function(infoAboutMessage, rawPayload) {
    if (this[nameOfAwaitingResponseMessageEventListener]) {
      const senderOfResponse = _createSenderOfMessageResponse(this, infoAboutMessage.idOfMessage);
      
      this[nameOfAwaitingResponseMessageEventListener](
        rawPayload, startIndexOfAwaitingResponseMessageBody, senderOfResponse
      );
    }
  };

  return _emitEventByIncomingMessage;
};

const _createSenderOfMessageResponse = function(responsiveWebSocketConnection, idOfMessage) {
  return new SenderOfResponse(responsiveWebSocketConnection[_connection], idOfMessage);
};

module.exports = createMethodToSetupOnMessageListenerOfInnerWebSocket; 


/***/ }),

/***/ "../../common/ResponsiveWebSocketConnection/creatingMethods/entryAboutPromiseOfRequest.js":
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

/***/ "../../common/ResponsiveWebSocketConnection/modules/SenderOfResponse.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const {
  binaryMessager,
  textMessager
} = __webpack_require__("../../common/ResponsiveWebSocketConnection/modules/messaging/messaging.js");

const SenderOfResponse = class {
  constructor(nonResponsiveWebSocketConnection, idOfMessage) {
    this[_nonResponsiveWebSocketConnection] = nonResponsiveWebSocketConnection;
    this[_idOfMessage] = idOfMessage;
  }
};

const _nonResponsiveWebSocketConnection = "_",
      _idOfMessage = "_i",
      Proto = SenderOfResponse.prototype;

const createMethodToSendResponse = function(createResponse, nameOfSendigResponseMethod) {
  return function sendResponse(message) {
    const messageWithHeader = createResponse(this[_idOfMessage], message);
    return this[_nonResponsiveWebSocketConnection][nameOfSendigResponseMethod](messageWithHeader);
  };
};

Proto.sendBinaryResponse = createMethodToSendResponse(
  binaryMessager.createBinaryResponseToAwaitingResponseMessage, "sendBinaryMessage");
  
Proto.sendTextResponse = createMethodToSendResponse(
  textMessager.createTextResponseToAwaitingResponseMessage, "sendTextMessage");

module.exports = SenderOfResponse;


/***/ }),

/***/ "../../common/ResponsiveWebSocketConnection/modules/createClassOfGeneratorOfSequenceIntegers/createClassOfGeneratorOfSequenceIntegers.js":
/***/ ((module) => {



const createClassOfGeneratorOfSequenceIntegers = function(TypedArray) {
  return class {
    constructor() {
      this[_numbers] = new TypedArray(1);
    }

    getNext() {
      return this[_numbers][0]++; //not this[_numbers][0] += 1
      //const numbers = this[_numbers];
      //numbers[0] += 1;
      //return numbers[0];
    }
  };
};

const _numbers = "_";

module.exports = createClassOfGeneratorOfSequenceIntegers;


/***/ }),

/***/ "../../common/ResponsiveWebSocketConnection/modules/messaging/messagers/ExeptionAtParsing.js":
/***/ ((module) => {



const ExeptionAtParsing = class extends Error {};

module.exports = ExeptionAtParsing;


/***/ }),

/***/ "../../common/ResponsiveWebSocketConnection/modules/messaging/messagers/binaryMessager/binaryMessager.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const {
  incomingAwaitingResponse: typesOfIncomingMessages_incomingAwaitingResponse,
  incomingWithoutWaitingResponse: typesOfIncomingMessages_incomingWithoutWaitingResponse,
  response: typesOfIncomingMessages_response
} = __webpack_require__("../../common/ResponsiveWebSocketConnection/modules/messaging/messagers/typesOfIncomingMessages.js");

const ExeptionAtParsing = __webpack_require__("../../common/ResponsiveWebSocketConnection/modules/messaging/messagers/ExeptionAtParsing.js"),
      insertArrayBufferToAnotherUnsafe = __webpack_require__("../../common/ResponsiveWebSocketConnection/modules/messaging/messagers/binaryMessager/insertArrayBufferToAnotherUnsafe.js");
      
const headers_withoutWaitingResponseBinary = 0b01100000,
      headers_awaitingResponseBinary = 0b11100000,
      headers_incomingBinaryResponse = 0b01000000;

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

const messager = {
  createUnrequestingBinaryMessage(payload) {
    const totalByteLength = 1 + payload.byteLength,
          message = new ArrayBuffer(totalByteLength),
          bytes = new Uint8Array(message);

    bytes[0] = headers_withoutWaitingResponseBinary;

    const startIndexOfPayload = 1;
    insertArrayBufferToAnotherUnsafe(message, startIndexOfPayload, payload);
    return message;
  },
  createAwaitingResponseBinaryMessage: createFnToSendMessageWithId(headers_awaitingResponseBinary),
  createBinaryResponseToAwaitingResponseMessage: createFnToSendMessageWithId(headers_incomingBinaryResponse),
  
  parseBinaryMessage(message) {
    const dataView = new DataView(message),
          header1stByte = dataView.getUint8(0);
    
    if (header1stByte === headers_incomingBinaryResponse) {
      const messageNum = dataView.getUint16(1);
      return {
        type: typesOfIncomingMessages_response,
        startIndex: 3,
        idOfMessage: messageNum
      };
    }
    if (header1stByte === headers_withoutWaitingResponseBinary) {
      return {
        type: typesOfIncomingMessages_incomingWithoutWaitingResponse,
        startIndex: 1
      };
    }
    if (header1stByte === headers_awaitingResponseBinary) {
      const messageNum = dataView.getUint16(1);
      return {
        type: typesOfIncomingMessages_incomingAwaitingResponse,
        startIndex: 3,
        idOfMessage: messageNum
      };
    }
    
    throw new ExeptionAtParsing("Hеизвестный заголовок сообщения.");
  },

  startIndexOfAwaitingResponseMessageBody: 3,
  startIndexOfUnrequestingMessageBody: 1,
  startIndexOfResponseMessageBody: 3
};

module.exports = messager;


/***/ }),

/***/ "../../common/ResponsiveWebSocketConnection/modules/messaging/messagers/binaryMessager/insertArrayBufferToAnotherUnsafe.js":
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

/***/ "../../common/ResponsiveWebSocketConnection/modules/messaging/messagers/textMessager/textMessager.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const {
  incomingAwaitingResponse: typeOfIncomingMessage_incomingAwaitingResponse,
  incomingWithoutWaitingResponse: typeOfIncomingMessage_incomingWithoutWaitingResponse,
  response: typeOfIncomingMessage_response
} = __webpack_require__("../../common/ResponsiveWebSocketConnection/modules/messaging/messagers/typesOfIncomingMessages.js");

const ExeptionAtParsing = __webpack_require__("../../common/ResponsiveWebSocketConnection/modules/messaging/messagers/ExeptionAtParsing.js");

const {
  uInt16ToCharPlus2Chars8BitString,
  extractUInt16FromStringUnsafe
} = __webpack_require__("../../common/ResponsiveWebSocketConnection/modules/messaging/messagers/textMessager/uInt16ViewIn2Char/uInt16ViewIn2Char.js");

const charCodeOfHeader_awaitingResponseTextMessage = 1,
      charCodeOfHeader_withoutWaitingResponseTextMessage = 2,
      charCodeOfHeader_responseTextMessage = 3;

const header_withoutWaitingResponseTextMessage = String.fromCharCode(
  charCodeOfHeader_withoutWaitingResponseTextMessage);

const textMessager = {
  createAwaitingResponseTextMessage(idOfMessage, text) {
    return uInt16ToCharPlus2Chars8BitString(charCodeOfHeader_awaitingResponseTextMessage, idOfMessage) + text;
  },
  createUnrequestingTextMessage(text) {
    return header_withoutWaitingResponseTextMessage + text;
  },
  createTextResponseToAwaitingResponseMessage(idOfMessage, text) {
    return uInt16ToCharPlus2Chars8BitString(charCodeOfHeader_responseTextMessage, idOfMessage) + text;
  },
  parseTextMessage(message) {
    const charCodeOfHeader = message[0].charCodeAt(0);

    if (charCodeOfHeader === charCodeOfHeader_awaitingResponseTextMessage) {
      const startIndexOfId = 1,
            idOfMessage = extractIdOfMessage(startIndexOfId, message);
      return {
        idOfMessage,
        type: typeOfIncomingMessage_incomingAwaitingResponse
      };
    }
    if (charCodeOfHeader === charCodeOfHeader_withoutWaitingResponseTextMessage) {
      return {
        type: typeOfIncomingMessage_incomingWithoutWaitingResponse
      };
    }
    if (charCodeOfHeader === charCodeOfHeader_responseTextMessage) {
      const startIndexOfId = 1,
            idOfMessage = extractIdOfMessage(startIndexOfId, message);
      return {
        idOfMessage,
        type: typeOfIncomingMessage_response
      };
    }

    throw new ExeptionAtParsing("Неизвестный заголовок сообщения.");
  },
  
  startIndexOfAwaitingResponseMessageBody: 3,
  startIndexOfUnrequestingMessageBody: 1,
  startIndexOfResponseMessageBody: 3
};

const extractIdOfMessage = function(startIndex, message) {
  const minLengthOfMessage = 3;
  if (message.length < minLengthOfMessage) {
    throw new ExeptionAtParsing("Message is too short");
  }
  return extractUInt16FromStringUnsafe(startIndex, message);
};

module.exports = textMessager;


/***/ }),

/***/ "../../common/ResponsiveWebSocketConnection/modules/messaging/messagers/textMessager/uInt16ViewIn2Char/uInt16ViewIn2Char.js":
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

/***/ "../../common/ResponsiveWebSocketConnection/modules/messaging/messagers/typesOfIncomingMessages.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const createEnum = __webpack_require__("../../../node_modules/createEnum/src/createEnum.js");

module.exports = createEnum(
  "incomingAwaitingResponse",
  "incomingWithoutWaitingResponse",
  "response"
);


/***/ }),

/***/ "../../common/ResponsiveWebSocketConnection/modules/messaging/messaging.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



module.exports = {
  binaryMessager: __webpack_require__("../../common/ResponsiveWebSocketConnection/modules/messaging/messagers/binaryMessager/binaryMessager.js"),
  textMessager: __webpack_require__("../../common/ResponsiveWebSocketConnection/modules/messaging/messagers/textMessager/textMessager.js"),
  ExeptionAtParsing: __webpack_require__("../../common/ResponsiveWebSocketConnection/modules/messaging/messagers/ExeptionAtParsing.js"),
  typesOfIncomingMessages: __webpack_require__("../../common/ResponsiveWebSocketConnection/modules/messaging/messagers/typesOfIncomingMessages.js")
};


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
/* harmony import */ var _ResponsiveWebSocketClient_ResponsiveWebSocketClient_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../ResponsiveWebSocketClient/ResponsiveWebSocketClient.js");
/* harmony import */ var _ResponsiveWebSocketClient_ResponsiveWebSocketClient_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_ResponsiveWebSocketClient_ResponsiveWebSocketClient_js__WEBPACK_IMPORTED_MODULE_0__);




_ResponsiveWebSocketClient_ResponsiveWebSocketClient_js__WEBPACK_IMPORTED_MODULE_0___default().setWebSocketClientClass(window.WebSocket);

(async function() {
  const client = new (_ResponsiveWebSocketClient_ResponsiveWebSocketClient_js__WEBPACK_IMPORTED_MODULE_0___default())(),
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