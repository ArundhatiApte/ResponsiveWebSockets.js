"use strict";

const {
  incomingAwaitingResponse: typesOfIncomingMessages_incomingAwaitingResponse,
  incomingWithoutWaitingResponse: typesOfIncomingMessages_incomingWithoutWaitingResponse,
  response: typesOfIncomingMessages_response
} = require("./../typesOfIncomingMessages");

const ExceptionAtParsing = require("./../ExceptionAtParsing"),
      insertArrayBufferToAnotherUnsafe = require("./insertArrayBufferToAnotherUnsafe");
      
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
  
  extractTypeOfIncomingMessage(message) {
    const header1stByte = new DataView(message).getUint8(0);

    switch (header1stByte) {
      case headers_incomingBinaryResponse:
        return typesOfIncomingMessages_response;
      case headers_withoutWaitingResponseBinary:
        return typesOfIncomingMessages_incomingWithoutWaitingResponse;
      case headers_awaitingResponseBinary:
        return typesOfIncomingMessages_incomingAwaitingResponse;
    }
    throw new ExceptionAtParsing("Message of unrecognized type.");
  },
  extractIdOfMessage(awaitingResponseOrResponseMessage) {
    return new DataView(awaitingResponseOrResponseMessage).getUint16(1);
  },

  startIndexOfAwaitingResponseMessageBody: 3,
  startIndexOfUnrequestingMessageBody: 1,
  startIndexOfResponseMessageBody: 3
};

module.exports = messager;
