"use strict";

const abstractMessager = require("./../../../../../common/messaging/textMessages/abstractMessager");

const {
  uInt16ToCharPlus2Chars8BitString
} = require("./../../../../../common/messaging/textMessages/uInt16ViewIn2Char/uInt16ViewIn2Char");

const {
  request: charCodesOfHeaders_request,
  response: charCodesOfHeaders_response,
  unrequestingMessage: charCodesOfHeaders_unrequestingMessage
} = require("./../../../../../common/messaging/textMessages/charCodesOfHeaders");

const header_unrequestingMessage = String.fromCharCode(charCodesOfHeaders_unrequestingMessage);

const textMessager = abstractMessager;

textMessager.createRequestMessage = function(idOfRequest, text) {
  return uInt16ToCharPlus2Chars8BitString(charCodesOfHeaders_request, idOfRequest) + text;
};
textMessager.createUnrequestingMessage = function(text) {
  return header_unrequestingMessage + text;
};
textMessager.createResponseMessage = function(idOfMessage, text) {
  return uInt16ToCharPlus2Chars8BitString(charCodesOfHeaders_response, idOfMessage) + text;
};

module.exports = textMessager;
