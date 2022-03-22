"use strict";

const {
  incomingAwaitingResponse: typeOfIncomingMessage_incomingAwaitingResponse,
  incomingWithoutWaitingResponse: typeOfIncomingMessage_incomingWithoutWaitingResponse,
  response: typeOfIncomingMessage_response
} = require("./../typesOfIncomingMessages");

const ExeptionAtParsing = require("./../ExeptionAtParsing");

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
  parseTextMessage(message) {
    const charCodeOfHeader = message.charCodeAt(0);

    if (charCodeOfHeader === charCodeOfHeader_awaitingResponseTextMessage) {
      const startIndexOfId = 1,
            idOfMessage = extractIdOfMessage(startIndexOfId, message);
      return {
        idOfMessage,
        type: typeOfIncomingMessage_incomingAwaitingResponse
      };
    }
    if (charCodeOfHeader === charCodeOfHeader_withoutWaitingResponseTextMessage) {
      return {
        type: typeOfIncomingMessage_incomingWithoutWaitingResponse
      };
    }
    if (charCodeOfHeader === charCodeOfHeader_responseTextMessage) {
      const startIndexOfId = 1,
            idOfMessage = extractIdOfMessage(startIndexOfId, message);
      return {
        idOfMessage,
        type: typeOfIncomingMessage_response
      };
    }

    throw new ExeptionAtParsing("Неизвестный заголовок сообщения.");
  },
  
  startIndexOfAwaitingResponseMessageBody: 3,
  startIndexOfUnrequestingMessageBody: 1,
  startIndexOfResponseMessageBody: 3
};

const extractIdOfMessage = function(startIndex, message) {
  const minLengthOfMessage = 3;
  if (message.length < minLengthOfMessage) {
    throw new ExeptionAtParsing("Message is too short");
  }
  return extractUInt16FromStringUnsafe(startIndex, message);
};

module.exports = textMessager;
