"use strict";

const {
  response: typeOfIncomingMessage_response,
  request: typeOfIncomingMessage_request,
  unrequestingMessage: typeOfIncomingMessage_unrequestingMessage
} = require("./../typesOfIncomingMessages");

const ErrorAtParsing = require("./../ErrorAtParsing");
const isLittleEndian = require("./isLittleEndian");

const {
  request: byteOfHeaders_request,
  response: byteOfHeaders_response,
  unrequestingMessage: byteOfHeaders_unrequestingMessage
} = require("./byteHeaders");

const fillHeaderAsRequestOrResponse = function(header8Bits, idOfMessage16Bits, messageInArrayBuffer) {
  const dataView = new DataView(messageInArrayBuffer);
  dataView.setUint8(0, header8Bits);
  dataView.setUint16(1, idOfMessage16Bits, isLittleEndian);
};

const binaryMessager = {
  extractTypeOfMessage(messageInArrayBuffer) {
    const header1stByte = new Uint8Array(messageInArrayBuffer)[0];

    switch (header1stByte) {
      case byteOfHeaders_response:
        return typeOfIncomingMessage_response;
      case byteOfHeaders_unrequestingMessage:
        return typeOfIncomingMessage_unrequestingMessage;
      case byteOfHeaders_request:
        return typeOfIncomingMessage_request;
    }
    throw new ErrorAtParsing("Message of unrecognized type.");
  },
  extractIdOfMessage(awaitingResponseOrResponseMessage) {
    return new DataView(awaitingResponseOrResponseMessage).getUint16(1, isLittleEndian);
  },

  fillHeaderAsRequest: fillHeaderAsRequestOrResponse.bind(null, byteOfHeaders_request),
  fillHeaderAsResponse: fillHeaderAsRequestOrResponse.bind(null, byteOfHeaders_response),
  fillHeaderAsUnrequestingMessage: function(messageInArrayBuffer) {
    return (new Uint8Array(messageInArrayBuffer))[0] = byteOfHeaders_unrequestingMessage;
  },

  sizeOfHeaderForRequest: 3,
  sizeOfHeaderForResponse: 3,
  sizeOfHeaderForUnrequestingMessage: 1
};

module.exports = binaryMessager;
