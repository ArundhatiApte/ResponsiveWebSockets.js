"use strict";

const abstractMessager = require(
  "./../../../../../../../common/ResponsiveWebSocketConnection/modules/messaging/textMessages/abstractMessager"
);

const {
  request: codesOfHeaders_request,
  response: codesOfHeaders_response,
  unrequestingMessage: codesOfHeaders_unrequestingMessage
} = require(
  "./../../../../../../../common/ResponsiveWebSocketConnection/modules/messaging/textMessages/codesOfHeaders"
);

const fillArrayBufferAsHeader = function(uint8OfHeader, arrayBuffer, uint16IdOfMessage) {
  const dataView = new DataView(arrayBuffer);

  dataView.setUint8(0, uint8OfHeader | ((uint16IdOfMessage << 16) >>> 28), true);
  dataView.setUint8(1, ((uint16IdOfMessage << 20) >>> 26), true);
  dataView.setUint8(2, ((uint16IdOfMessage << 26) >>> 26), true);
};

const textMessager = abstractMessager;

textMessager.fillBufferAsHeaderOfRequest = fillArrayBufferAsHeader.bind(null, codesOfHeaders_request);
textMessager.fillBufferAsHeaderOfResponse = fillArrayBufferAsHeader.bind(null, codesOfHeaders_response);
textMessager.headerOfUnrequestingMessage = String.fromCharCode(codesOfHeaders_unrequestingMessage);

module.exports = textMessager;
