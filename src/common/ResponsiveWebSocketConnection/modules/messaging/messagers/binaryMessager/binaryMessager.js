"use strict";

const ExeptionAtParsing = require("./../ExeptionAtParsing"),
      typesOfIncomingMessages = require("./../typesOfIncomingMessages"),
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
