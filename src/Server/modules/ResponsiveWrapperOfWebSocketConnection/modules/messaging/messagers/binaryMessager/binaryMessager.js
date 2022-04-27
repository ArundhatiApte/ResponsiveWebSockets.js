"use strict";

const abstractMessager = require(
  "./../../../../../../../common/ResponsiveWebSocketConnection/modules/messaging/binaryMessages/abstractMessager"
);
const {
  request: bytesOfHeaders_request,
  response: bytesOfHeaders_response,
  unrequestingMessage: bytesOfHeaders_unrequestingMessage
} = require(
  "./../../../../../../../common/ResponsiveWebSocketConnection/modules/messaging/binaryMessages/byteHeaders"
);

const fillArrayBufferAsHeader = function(uint8OfHeader, arrayBuffer, uint16IdOfMessage) {
  const dataView = new DataView(arrayBuffer);

  dataView.setUint8(0, uint8OfHeader);
  dataView.setUint16(1, uint16IdOfMessage);
};

const binaryMessager = abstractMessager;

binaryMessager.fillBufferAsHeaderOfRequest = fillArrayBufferAsHeader.bind(null, bytesOfHeaders_request);

binaryMessager.headerOfUnrequestingMessage = (function() {
  const arrayBuffer = new ArrayBuffer(1);
  new DataView(arrayBuffer).setUint8(0, bytesOfHeaders_unrequestingMessage);
  return arrayBuffer;
})();

binaryMessager.fillBufferAsHeaderOfResponse = fillArrayBufferAsHeader.bind(null, bytesOfHeaders_response);

module.exports = binaryMessager;
