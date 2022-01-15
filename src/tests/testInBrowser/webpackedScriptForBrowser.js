/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../../ResponsiveWebSocketClient/ResponsiveWebSocketClient.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const WebSocketClient = __webpack_require__("../../ResponsiveWebSocketClient/modules/WebSocketClient.js"),
      ResponsiveWebSoket = __webpack_require__("../../common/ResponsiveWebSocketConnection/ResponsiveWebSocketConnection.js");
      
const {_connection, _onError} = ResponsiveWebSoket._namesOfPrivateProperties;

const ResponsiveWebSocketClient = class extends ResponsiveWebSoket {
  constructor(webSocketClient) {
    super(webSocketClient || new WebSocketClient());
  }

  setLoadListener(listener) {
    this[_onLoad] = listener;
  }
  
  _setupListeners() {
    this._setupOnLoadListener();
    this._setupOnErrorListener();
    this._setupOnMessageListener();
  }
  
  _setupOnLoadListener() {
    this[_connection].onLoad = () => {
      this[_connection].onLoad = null;
      if (this[_onLoad]) {
        this[_onLoad]();
      }
    };
  }
  
  _setupOnErrorListener() {
    this[_connection].onError = (error) => {
      if (this[_onError]) {
        this[_onError](error);
      }
    };
  }
  
  connect(url) {
    return this[_connection].connect(url);
  }
  
  close() {
    return this[_connection].close();
  }
};

const _onLoad = "_77";

ResponsiveWebSocketClient.messageContentTypes = ResponsiveWebSoket.messageContentTypes;
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
  
  close(reason, code) {
    return this[_webSocketClient].close(reason, code);
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
Proto._emitOnClose = _createMethodToEmitEvent("onCLose");
      
WebSocketClient.setWebSocketClientClass = function(WebSocketClient) {
  W3CWebSocketClientClass = WebSocketClient;
};

module.exports = WebSocketClient;


/***/ }),

/***/ "../../common/ResponsiveWebSocketConnection/ResponsiveWebSocketConnection.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const {
  binaryMessager,
  textMessager,
  ExeptionAtParsing
} = __webpack_require__("../../common/ResponsiveWebSocketConnection/modules/messaging/messagers.js");

const createEnum = __webpack_require__("../../common/ResponsiveWebSocketConnection/modules/createEnum/createEnum.js"),
      SenderOfResponse = __webpack_require__("../../common/ResponsiveWebSocketConnection/modules/SenderOfResponse.js"),
      MessageIdGen = __webpack_require__("../../common/ResponsiveWebSocketConnection/modules/createClassOfGeneratorOfSequenceIntegers/createClassOfGeneratorOfSequenceIntegers.js")(Uint16Array);

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

    this._setupListeners();
  }
  
  set maxTimeMSToWaitResponse(ms) {
    this[_maxTimeMSToWaitResponse] = ms;
  }
  
  get maxTimeMSToWaitResponse() {
    return this[_maxTimeMSToWaitResponse];
  }

  setUnrequestingBinaryMessageListener(listener) {
    this[_onUnrequestingBinaryMessage] = listener;
  }
  
  setUnrequestingTextMessageListener(listener) {
    this[_onUnrequestingTextMessage] = listener;
  }

  setErrorListener(listener) {
    this[_connection].onError = (event) => {
      return listener.call(this, event);
    };
  }
  
  setCloseListener(listener) {
    this[_connection].onClose = (event) => {
      return listener.call(this, event);
    };
  }
  
  _setupOnMessageListener() {
    const connection = this[_connection];
    
    let listener = this._emitEventByIncomingBinaryMessage.bind(this);
    connection.onBinaryMessage = listener;

    listener = this._emitEventByIncomingTextMessage.bind(this);
    connection.onTextMessage = listener;
  }
  
  _createSenderOfMessageResponse(numOfMessage) {
    return new SenderOfResponse(this[_connection], numOfMessage);
  }
  
  _createTimeoutToReceiveResponse(idOfMessage, rejectPromise, maxTimeMSToWaitResponse) {
    return setTimeout(
      _rejectMessageResponsePromiseAndDeleteEntry.bind(this, rejectPromise, idOfMessage),
      maxTimeMSToWaitResponse
    );
  }
  
  _rejectMessageResponsePromiseAndDeleteEntry(rejectPromise, idOfMessage) {
    this[_idOfAwaitingResponseMessageToPromise].delete(idOfMessage);
    rejectPromise(new TimeoutToReceiveResponseExeption(
      "ResponsiveWebSocketConnection:: timeout for receiving response."));
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
  _onAwaitingResponseBinaryMessage
);

Proto._emitEventByIncomingTextMessage = createMethodToSetupOnMessageListenerOfInnerWebSocket(
  textMessager.parseTextMessage,
  messageContentTypes.text,
  _onUnrequestingTextMessage,
  _onAwaitingResponseTextMessage
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

const _rejectMessageResponsePromiseAndDeleteEntry = Proto._rejectMessageResponsePromiseAndDeleteEntry;

ResponsiveWebSocketConnection.contentTypesOfMessages = messageContentTypes;
ResponsiveWebSocketConnection.TimeoutToReceiveResponseExeption = TimeoutToReceiveResponseExeption;


/***/ }),

/***/ "../../common/ResponsiveWebSocketConnection/creatingMethods/createMethodToSendAwaitingResponseMessage.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const {
  _maxTimeMSToWaitResponse,
  _genOfAwaitingResponseMessageId,
  _idOfAwaitingResponseMessageToPromise,
  _connection
} = __webpack_require__("../../common/ResponsiveWebSocketConnection/ResponsiveWebSocketConnection.js")._namesOfPrivateProperties;

const {
  create: entryAboutAwaitingPromise_create
} = __webpack_require__("../../common/ResponsiveWebSocketConnection/creatingMethods/entryAboutAwaitingPromise.js");

const createMethodToSendAwaitingResponseMessage = function(
  createAwaitingResponseMessage, nameOfSendingMessageMethod
) {
  return function sendAwaitingResponseMessage(message, maxTimeMSToWaitResponse) {
    return new Promise((resolve, reject) => {
      if (!maxTimeMSToWaitResponse) {
        maxTimeMSToWaitResponse = this[_maxTimeMSToWaitResponse];
      }
      const idOfMessage = this[_genOfAwaitingResponseMessageId].getNext();
      const timeoutToReject = this._createTimeoutToReceiveResponse(
        idOfMessage, reject, maxTimeMSToWaitResponse
      );
      
      const entryAboutPromise = entryAboutAwaitingPromise_create(resolve, timeoutToReject);
      this[_idOfAwaitingResponseMessageToPromise].set(idOfMessage, entryAboutPromise);
      const messageWithHeader = createAwaitingResponseMessage(idOfMessage, message);
      this[_connection][nameOfSendingMessageMethod](messageWithHeader);
    });
  };
};

module.exports = createMethodToSendAwaitingResponseMessage;


/***/ }),

/***/ "../../common/ResponsiveWebSocketConnection/creatingMethods/createMethodToSetupOnMessageListenerOfInnerWebSocket.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const {
  response: typesOfIncomingMessages_response,
  incomingWithoutWaitingResponse: typesOfIncomingMessages_incomingWithoutWaitingResponse,
  incomingAwaitingResponse: typesOfIncomingMessages_incomingAwaitingResponse 
} = __webpack_require__("../../common/ResponsiveWebSocketConnection/modules/messaging/messagers.js").typesOfIncomingMessages;

const {
  _idOfAwaitingResponseMessageToPromise
} = __webpack_require__("../../common/ResponsiveWebSocketConnection/ResponsiveWebSocketConnection.js")._namesOfPrivateProperties;

const {
  nameOfTimeout: entryAboutAwaitingPromise_nameOfTimeout,
  nameOfPromiseResolver: entryAboutAwaitingPromise_nameOfPromiseResolver
} = __webpack_require__("../../common/ResponsiveWebSocketConnection/creatingMethods/entryAboutAwaitingPromise.js");

const createMethodToSetupOnMessageListenerOfInnerWebSocket = function(
  parseMessage, typeOfMessageContent,
  nameOfUnrequestingMessageEventListener,
  nameOfAwaitingResponseMessageEventListener
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
    
    if (!awaitingPromise) {
      return;
    }
    clearTimeout(awaitingPromise[entryAboutAwaitingPromise_nameOfTimeout]);
    const dataForCallback = {
      type: typeOfMessageContent,
      startIndex: infoAboutMessage.startIndex,
      message: rawPayload
    };

    table.delete(numOfMessage);
    awaitingPromise[entryAboutAwaitingPromise_nameOfPromiseResolver](dataForCallback);
  };

  const _emitUnrequestingMessageEvent = function(infoAboutMessage, rawPayload) {
    if (this[nameOfUnrequestingMessageEventListener]) {
      this[nameOfUnrequestingMessageEventListener](rawPayload, infoAboutMessage.startIndex);
    }
  };
  
  const _emitAwaitingResponseMessageEvent = function(infoAboutMessage, rawPayload) {
    if (this[nameOfAwaitingResponseMessageEventListener]) {
      const senderOfResponse = this._createSenderOfMessageResponse(infoAboutMessage.idOfMessage);
      
      this[nameOfAwaitingResponseMessageEventListener](
        rawPayload, infoAboutMessage.startIndex, senderOfResponse
      );
    }
  };

  return _emitEventByIncomingMessage;
};

module.exports = createMethodToSetupOnMessageListenerOfInnerWebSocket; 


/***/ }),

/***/ "../../common/ResponsiveWebSocketConnection/creatingMethods/entryAboutAwaitingPromise.js":
/***/ ((module) => {



const create = function(resolvePromise, timeoutToWait) {
  return [resolvePromise, timeoutToWait];
};

const nameOfPromiseResolver = 0,
      nameOfTimeout = 1;

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
} = __webpack_require__("../../common/ResponsiveWebSocketConnection/modules/messaging/messagers.js");

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

/***/ "../../common/ResponsiveWebSocketConnection/modules/createEnum/createEnum.js":
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

/***/ "../../common/ResponsiveWebSocketConnection/modules/messaging/messagers.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



module.exports = {
  binaryMessager: __webpack_require__("../../common/ResponsiveWebSocketConnection/modules/messaging/messagers/binaryMessager/binaryMessager.js"),
  textMessager: __webpack_require__("../../common/ResponsiveWebSocketConnection/modules/messaging/messagers/textMessager/textMessager.js"),
  ExeptionAtParsing: __webpack_require__("../../common/ResponsiveWebSocketConnection/modules/messaging/messagers/ExeptionAtParsing.js"),
  typesOfIncomingMessages: __webpack_require__("../../common/ResponsiveWebSocketConnection/modules/messaging/messagers/typesOfIncomingMessages.js")
};


/***/ }),

/***/ "../../common/ResponsiveWebSocketConnection/modules/messaging/messagers/ExeptionAtParsing.js":
/***/ ((module) => {



const ExeptionAtParsing = class extends Error {};

module.exports = ExeptionAtParsing;


/***/ }),

/***/ "../../common/ResponsiveWebSocketConnection/modules/messaging/messagers/binaryMessager/binaryMessager.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const ExeptionAtParsing = __webpack_require__("../../common/ResponsiveWebSocketConnection/modules/messaging/messagers/ExeptionAtParsing.js"),
      typesOfIncomingMessages = __webpack_require__("../../common/ResponsiveWebSocketConnection/modules/messaging/messagers/typesOfIncomingMessages.js"),
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
  
  parseBinaryMessage(message, startIndex = 0) {
    const dataView = new DataView(message),
          header1stByte = dataView.getUint8(startIndex);
    
    if (header1stByte === headers_incomingBinaryResponse) {
      const messageNum = dataView.getUint16(startIndex + 1);
      return {
        type: typesOfIncomingMessages.response,
        startIndex: startIndex + 3,
        idOfMessage: messageNum
      };
    }
    if (header1stByte === headers_withoutWaitingResponseBinary) {
      return {
        type: typesOfIncomingMessages.incomingWithoutWaitingResponse,
        startIndex: startIndex + 1
      };
    }
    if (header1stByte === headers_awaitingResponseBinary) {
      const messageNum = dataView.getUint16(startIndex + 1);
      return {
        type: typesOfIncomingMessages.incomingAwaitingResponse,
        startIndex: startIndex + 3,
        idOfMessage: messageNum
      };
    }
    
    throw new ExeptionAtParsing("Hеизвестный заголовок сообщения.");
  },

  typesOfIncomingMessages
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



const createEnum = __webpack_require__("../../common/ResponsiveWebSocketConnection/modules/createEnum/createEnum.js"),
      typesOfIncomingMessages = __webpack_require__("../../common/ResponsiveWebSocketConnection/modules/messaging/messagers/typesOfIncomingMessages.js"),
      ExeptionAtParsing = __webpack_require__("../../common/ResponsiveWebSocketConnection/modules/messaging/messagers/ExeptionAtParsing.js");

const {
  incomingAwaitingResponse: typeOfIncomingMessage_incomingAwaitingResponse,
  incomingWithoutWaitingResponse: typeOfIncomingMessage_incomingWithoutWaitingResponse,
  response: typeOfIncomingMessage_response
} = typesOfIncomingMessages;

const {
  uInt16To2Chars8BitString,
  extractUInt16FromString
} = __webpack_require__("../../common/ResponsiveWebSocketConnection/modules/messaging/messagers/textMessager/uInt16ViewIn2Char/uInt16ViewIn2Char.js");

const header_awaitingResponseTextMessage = "\t",
      header_withoutWaitingResponseTextMessage = "\n",
      header_responseTextMessage = "\r";

const textMessager = {
  createAwaitingResponseTextMessage(idOfMessage, text) {
    return header_awaitingResponseTextMessage +
      uInt16To2Chars8BitString(idOfMessage) +
      text;
  },
  createUnrequestingTextMessage(text) {
    return header_withoutWaitingResponseTextMessage + text;
  },
  createTextResponseToAwaitingResponseMessage(idOfMessage, text) {
    return header_responseTextMessage +
      uInt16To2Chars8BitString(idOfMessage) +
      text;
  },
  parseTextMessage(message) {
    const header = message[0];

    if (header === header_awaitingResponseTextMessage) {
      const startIndexOfId = 1,
            idOfMessage = extractIdOfMessage(startIndexOfId, message);
      return {
        idOfMessage,
        type: typeOfIncomingMessage_incomingAwaitingResponse,
        startIndex: 3
      };
    }
    if (header === header_withoutWaitingResponseTextMessage) {
      return {
        type: typeOfIncomingMessage_incomingWithoutWaitingResponse,
        startIndex: 1
      };
    }
    if (header === header_responseTextMessage) {
      const startIndexOfId = 1,
            idOfMessage = extractIdOfMessage(startIndexOfId, message);
      return {
        idOfMessage,
        type: typeOfIncomingMessage_response,
        startIndex: 3
      };
    }

    throw new ExeptionAtParsing("Неизвестный заголовок сообщения.");
  }
};

const extractIdOfMessage = function(startIndex, message) {
  const number = extractUInt16FromString(startIndex, message);
  if (number === null) {
    throw new ExeptionAtParsing("Cant extract id of message");
  }
  return number;
};

module.exports = textMessager;


/***/ }),

/***/ "../../common/ResponsiveWebSocketConnection/modules/messaging/messagers/textMessager/uInt16ViewIn2Char/uInt16ViewIn2Char.js":
/***/ ((module) => {



const stringFromCharCodes = String.fromCharCode;

const uInt16To2Chars8BitString = function(uInt16) {
  const bytes = new Uint16Array([uInt16]).buffer;
  const uInt8s = new Uint8Array(bytes),
        firstByte = uInt8s[0],
        secondByte = uInt8s[1];
  return stringFromCharCodes(firstByte, secondByte);
};

const extractUInt16FromString = function(startIndex, string) {
  const indexOfSecondByte = startIndex + 1;
  if (string.length <= indexOfSecondByte) {
    return null;
  }
  const firstCharCode = string.charCodeAt(startIndex),
        secondCharCode = string.charCodeAt(indexOfSecondByte),
        bytes = new Uint8Array([firstCharCode, secondCharCode]).buffer;
  
  const out = new Uint16Array(bytes)[0];
  return out;
};

module.exports = {
  uInt16To2Chars8BitString,
  extractUInt16FromString
};


/***/ }),

/***/ "../../common/ResponsiveWebSocketConnection/modules/messaging/messagers/typesOfIncomingMessages.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const createEnum = __webpack_require__("../../common/ResponsiveWebSocketConnection/modules/createEnum/createEnum.js");

module.exports = createEnum(
  "incomingAwaitingResponse",
  "incomingWithoutWaitingResponse",
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
/* harmony import */ var _ResponsiveWebSocketClient_ResponsiveWebSocketClient__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../ResponsiveWebSocketClient/ResponsiveWebSocketClient.js");
/* harmony import */ var _ResponsiveWebSocketClient_ResponsiveWebSocketClient__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_ResponsiveWebSocketClient_ResponsiveWebSocketClient__WEBPACK_IMPORTED_MODULE_0__);




_ResponsiveWebSocketClient_ResponsiveWebSocketClient__WEBPACK_IMPORTED_MODULE_0___default().setWebSocketClientClass(window.WebSocket);

(async function() {
  const client = new (_ResponsiveWebSocketClient_ResponsiveWebSocketClient__WEBPACK_IMPORTED_MODULE_0___default())(),
        port = 4443,
        url = "ws://127.0.0.1:" + port + "/wsAPI/awjoiadwj";

  await client.connect(url);

  const sendTextAndReceiveResponse = async function(client, sendedText) {
    const {
      message, startIndex
    } = await client.sendAwaitingResponseTextMessage(sendedText);
    return message.slice(startIndex);
  };

  const sendInt32AndReceiveInt32 = async function(client, sendedInt32) {
    const message = new ArrayBuffer(4);
    let dataView = new DataView(message);
    dataView.setInt32(0, sendedInt32);

    const {
      message: response, startIndex
    } = await client.sendAwaitingResponseBinaryMessage(message);
    dataView = new DataView(response);
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