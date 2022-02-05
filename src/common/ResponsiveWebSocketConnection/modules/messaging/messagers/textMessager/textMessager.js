"use strict";

const typesOfIncomingMessages = require("./../typesOfIncomingMessages"),
      ExeptionAtParsing = require("./../ExeptionAtParsing");

const {
  incomingAwaitingResponse: typeOfIncomingMessage_incomingAwaitingResponse,
  incomingWithoutWaitingResponse: typeOfIncomingMessage_incomingWithoutWaitingResponse,
  response: typeOfIncomingMessage_response
} = typesOfIncomingMessages;

const {
  uInt16To2Chars8BitString,
  extractUInt16FromString
} = require("./uInt16ViewIn2Char");

const header_awaitingResponseTextMessage = "\t",
      header_withoutWaitingResponseTextMessage = "\n",
      header_responseTextMessage = "\r";

const textMessager = {
  createAwaitingResponseTextMessage(idOfMessage, text) {
    return header_awaitingResponseTextMessage +
      uInt16To2Chars8BitString(idOfMessage) +
      text;
  },
  createUnrequestingTextMessage(text) {
    return header_withoutWaitingResponseTextMessage + text;
  },
  createTextResponseToAwaitingResponseMessage(idOfMessage, text) {
    return header_responseTextMessage +
      uInt16To2Chars8BitString(idOfMessage) +
      text;
  },
  parseTextMessage(message) {
    const header = message[0];

    if (header === header_awaitingResponseTextMessage) {
      const startIndexOfId = 1,
            idOfMessage = extractIdOfMessage(startIndexOfId, message);
      return {
        idOfMessage,
        type: typeOfIncomingMessage_incomingAwaitingResponse,
        startIndex: 3
      };
    }
    if (header === header_withoutWaitingResponseTextMessage) {
      return {
        type: typeOfIncomingMessage_incomingWithoutWaitingResponse,
        startIndex: 1
      };
    }
    if (header === header_responseTextMessage) {
      const startIndexOfId = 1,
            idOfMessage = extractIdOfMessage(startIndexOfId, message);
      return {
        idOfMessage,
        type: typeOfIncomingMessage_response,
        startIndex: 3
      };
    }

    throw new ExeptionAtParsing("Неизвестный заголовок сообщения.");
  }
};

const extractIdOfMessage = function(startIndex, message) {
  const number = extractUInt16FromString(startIndex, message);
  if (number === null) {
    throw new ExeptionAtParsing("Cant extract id of message");
  }
  return number;
};

module.exports = textMessager;
