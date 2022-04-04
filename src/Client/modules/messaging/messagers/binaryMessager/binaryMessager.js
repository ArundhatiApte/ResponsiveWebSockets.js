"use strict";

const insertArrayBufferToAnotherUnsafe = require("./insertArrayBufferToAnotherUnsafe");
const abstractMessager = require("./../../../../../common/messaging/binaryMessages/abstractMessager");

const {
  request: byteOfHeaders_request,
  response: byteOfHeaders_response,
  unrequestingMessage: byteOfHeaders_unrequestingMessage
} = require("./../../../../../common/messaging/binaryMessages/byteHeaders");

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
