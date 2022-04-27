"use strict";

const abstractMessager = require(
  "./../../../../../common/ResponsiveWebSocketConnection/modules/messaging/textMessages/abstractMessager"
);

const {
  request: codesOfHeaders_request,
  response: codesOfHeaders_response,
  unrequestingMessage: codesOfHeaders_unrequestingMessage
} = require(
  "./../../../../../common/ResponsiveWebSocketConnection/modules/messaging/textMessages/codesOfHeaders"
);

const stringFromCharCodes = String.fromCharCode;
const header_unrequestingMessage = stringFromCharCodes(codesOfHeaders_unrequestingMessage);
const textMessager = abstractMessager;

textMessager.createRequestMessage = function(uint16IdOfRequest, text) {
  return stringFromCharCodes(
    codesOfHeaders_request | ((uint16IdOfRequest << 16) >>> 28),
    ((uint16IdOfRequest << 20) >>> 26),
    ((uint16IdOfRequest << 26) >>> 26),
  ) + text;
};

textMessager.createUnrequestingMessage = function(text) {
  return header_unrequestingMessage + text;
};

textMessager.createResponseMessage = function(uint16IdOMessage, text) {
  return stringFromCharCodes(
    codesOfHeaders_response | ((uint16IdOMessage << 16) >>> 28),
    ((uint16IdOMessage << 20) >>> 26),
    ((uint16IdOMessage << 26) >>> 26),
  ) + text;
};

module.exports = textMessager;
