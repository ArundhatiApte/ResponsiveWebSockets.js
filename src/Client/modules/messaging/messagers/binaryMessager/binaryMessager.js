"use strict";

const abstractMessager = require(
  "./../../../../../common/ResponsiveWebSocketConnection/modules/messaging/binaryMessages/abstractMessager"
);

const {
  request: byteOfHeaders_request,
  response: byteOfHeaders_response,
  unrequestingMessage: byteOfHeaders_unrequestingMessage
} = require("./../../../../../common/ResponsiveWebSocketConnection/modules/messaging/binaryMessages/byteHeaders");

const insertArrayBufferToAnotherUnsafe = require("./insertArrayBufferToAnotherUnsafe");

const createMessageWithId = function(header8Bits, idOfMessage16Bits, payload) {
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

const binaryMessager = abstractMessager;

binaryMessager.createUnrequestingMessage = function(payload) {
  const totalByteLength = 1 + payload.byteLength;
  const message = new ArrayBuffer(totalByteLength);
  const dataView = new DataView(message);

  dataView.setUint8(0, byteOfHeaders_unrequestingMessage);

  const startIndexOfPayload = 1;
  insertArrayBufferToAnotherUnsafe(message, startIndexOfPayload, payload);
  return message;
};

binaryMessager.createRequestMessage = createMessageWithId.bind(null, byteOfHeaders_request);
binaryMessager.createResponseMessage = createMessageWithId.bind(null, byteOfHeaders_response);

module.exports = binaryMessager;
