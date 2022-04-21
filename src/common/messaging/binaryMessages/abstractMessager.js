"use strict";

const {
  response: typeOfIncomingMessage_response,
  request: typeOfIncomingMessage_request,
  unrequestingMessage: typeOfIncomingMessage_unrequestingMessage
} = require("./../typesOfIncomingMessages");

const ErrorAtParsing = require("./../ErrorAtParsing");

const {
  request: byteOfHeaders_request,
  response: byteOfHeaders_response,
  unrequestingMessage: byteOfHeaders_unrequestingMessage
} = require("./byteHeaders");

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
    throw new ErrorAtParsing("Message of unrecognized type.");
  },
  extractIdOfMessage(awaitingResponseOrResponseMessage) {
    return new DataView(awaitingResponseOrResponseMessage).getUint16(1);
  },

  startIndexOfBodyInRequest: 3,
  startIndexOfBodyInUnrequestingMessage: 1,
  startIndexOfBodyInResponse: 3
};

module.exports = abstractMessager;
