"use strict";

const {
  request: typeOfIncomingMessage_request,
  unrequestingMessage: typeOfIncomingMessage_unrequestingMessage,
  response: typeOfIncomingMessage_response
} = require("./../typesOfIncomingMessages");

const ExceptionAtParsing = require("./../ExceptionAtParsing");

const {
  request: charCodesOfHeaders_request,
  response: charCodesOfHeaders_response,
  unrequestingMessage: charCodesOfHeaders_unrequestingMessage
} = require("./charCodesOfHeaders");

const { extractUInt16FromStringUnsafe } = require("./uInt16ViewIn2Char/uInt16ViewIn2Char");

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
