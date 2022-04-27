"use strict";

const {
  request: typeOfIncomingMessage_request,
  unrequestingMessage: typeOfIncomingMessage_unrequestingMessage,
  response: typeOfIncomingMessage_response
} = require("./../typesOfIncomingMessages");

const ErrorAtParsing = require("./../ErrorAtParsing");

const {
  request: codesOfHeader_request,
  response: codesOfHeader_response,
  unrequestingMessage: codesOfHeader_unrequestingMessage
} = require("./codesOfHeaders");

const abstractMessager = {
  extractTypeOfIncomingMessage(message) {
    const codeOfHeader = message.charCodeAt(0) & 0b0000_0000_0011_0000;
    switch (codeOfHeader) {
      case codesOfHeader_request:
        return typeOfIncomingMessage_request;
      case codesOfHeader_unrequestingMessage:
        return typeOfIncomingMessage_unrequestingMessage;
      case codesOfHeader_response:
        return typeOfIncomingMessage_response;
    }
    throw new ErrorAtParsing("Message of unrecognized type.");
  },
  extractIdOfMessage(awaitingResponseMessageOrResponse) {
    const minLengthOfMessage = 3;
    const message = awaitingResponseMessageOrResponse;
    if (message.length < minLengthOfMessage) {
      throw new ErrorAtParsing("Message is too short");
    }
    const first4Bit = message.charCodeAt(0) & 0b1111;
    const middle6Bit = message.charCodeAt(1) & 0b111111;
    const last6Bit = message.charCodeAt(2) & 0b111111;

    return (first4Bit << 12) | (middle6Bit << 6) | last6Bit;
  },
  startIndexOfBodyInRequest: 3,
  startIndexOfBodyInUnrequestingMessage: 1,
  startIndexOfBodyInResponse: 3
};

module.exports = abstractMessager;
