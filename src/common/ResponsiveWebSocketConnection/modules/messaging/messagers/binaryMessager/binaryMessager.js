"use strict";

const {
  incomingAwaitingResponse: typesOfIncomingMessages_incomingAwaitingResponse,
  incomingWithoutWaitingResponse: typesOfIncomingMessages_incomingWithoutWaitingResponse,
  response: typesOfIncomingMessages_response
} = require("./../typesOfIncomingMessages");

const ExeptionAtParsing = require("./../ExeptionAtParsing"),
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
