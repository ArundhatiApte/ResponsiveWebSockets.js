"use strict";

const abstractMessager = require("./../../../../../../../common/messaging/textMessages/abstractMessager");

const {
  request: charCodesOfHeaders_request,
  response: charCodesOfHeaders_response,
  unrequestingMessage: charCodesOfHeaders_unrequestingMessage
} = require("./../../../../../../../common/messaging/textMessages/charCodesOfHeaders");

const {
  uInt16ToCharPlus2Chars8BitString
} = require("./../../../../../../../common/messaging/textMessages/uInt16ViewIn2Char/uInt16ViewIn2Char");

const textMessager = {
  extractTypeOfIncomingMessage: abstractMessager.extractTypeOfIncomingMessage,
  extractIdOfMessage: abstractMessager.extractIdOfMessage,

  startIndexOfBodyInRequest: abstractMessager.startIndexOfBodyInRequest,
  startIndexOfBodyInResponse: abstractMessager.startIndexOfBodyInResponse,
  startIndexOfBodyInUnrequestingMessage: abstractMessager.startIndexOfBodyInUnrequestingMessage,

  createHeaderOfRequest(uint16IdOfMessage) {
    return uInt16ToCharPlus2Chars8BitString(charCodesOfHeaders_request, uint16IdOfMessage);
  },
  createHeaderOfResponse(uint16IdOfMessage) {
    return uInt16ToCharPlus2Chars8BitString(charCodesOfHeaders_response, uint16IdOfMessage);
  },
  headerOfUnrequestingMessage: String.fromCharCode(charCodesOfHeaders_unrequestingMessage)
};

module.exports = textMessager;
