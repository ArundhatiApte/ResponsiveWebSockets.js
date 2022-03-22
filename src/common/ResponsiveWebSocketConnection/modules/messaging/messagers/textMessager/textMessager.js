"use strict";

const {
  incomingAwaitingResponse: typeOfIncomingMessage_incomingAwaitingResponse,
  incomingWithoutWaitingResponse: typeOfIncomingMessage_incomingWithoutWaitingResponse,
  response: typeOfIncomingMessage_response
} = require("./../typesOfIncomingMessages");

const ExceptionAtParsing = require("./../ExceptionAtParsing");

const {
  uInt16ToCharPlus2Chars8BitString,
  extractUInt16FromStringUnsafe
} = require("./uInt16ViewIn2Char/uInt16ViewIn2Char");

const charCodeOfHeader_awaitingResponseTextMessage = 1,
      charCodeOfHeader_withoutWaitingResponseTextMessage = 2,
      charCodeOfHeader_responseTextMessage = 3;

const header_withoutWaitingResponseTextMessage = String.fromCharCode(
  charCodeOfHeader_withoutWaitingResponseTextMessage);

const textMessager = {
  createAwaitingResponseTextMessage(idOfMessage, text) {
    return uInt16ToCharPlus2Chars8BitString(charCodeOfHeader_awaitingResponseTextMessage, idOfMessage) + text;
  },
  createUnrequestingTextMessage(text) {
    return header_withoutWaitingResponseTextMessage + text;
  },
  createTextResponseToAwaitingResponseMessage(idOfMessage, text) {
    return uInt16ToCharPlus2Chars8BitString(charCodeOfHeader_responseTextMessage, idOfMessage) + text;
  },
  extractTypeOfIncomingMessage(message) {
    const charCodeOfHeader = message.charCodeAt(0);
    
    switch (charCodeOfHeader) {
      case charCodeOfHeader_awaitingResponseTextMessage:
        return typeOfIncomingMessage_incomingAwaitingResponse;
      case charCodeOfHeader_withoutWaitingResponseTextMessage:
        return typeOfIncomingMessage_incomingWithoutWaitingResponse;
      case charCodeOfHeader_responseTextMessage:
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
  
  startIndexOfAwaitingResponseMessageBody: 3,
  startIndexOfUnrequestingMessageBody: 1,
  startIndexOfResponseMessageBody: 3
};

module.exports = textMessager;
