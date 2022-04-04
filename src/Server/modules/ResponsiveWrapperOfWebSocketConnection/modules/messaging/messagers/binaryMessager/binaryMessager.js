"use strict";

const abstractMessager = require("./../../../../../../../common/messaging/binaryMessages/abstractMessager");
const {
  request: bytesOfHeaders_request,
  response: bytesOfHeaders_response,
  unrequestingMessage: bytesOfHeaders_unrequestingMessage
} = require("./../../../../../../../common/messaging/binaryMessages/byteHeaders");

const createCreatingHeaderWithIdFn = function(uint8OfHeader) {
  return function(uint16IdOfMessage) {
    const arrayBuffer = new ArrayBuffer(3);
    const dataView = new DataView(arrayBuffer);

    dataView.setUint8(0, uint8OfHeader);
    dataView.setUint16(1, uint16IdOfMessage);
    
    return arrayBuffer;
  };
};

const binaryMessager = abstractMessager;

binaryMessager.createHeaderOfRequest = createCreatingHeaderWithIdFn(bytesOfHeaders_request);
binaryMessager.headerOfUnrequestingMessage = (function() {
  const arrayBuffer = new ArrayBuffer(1);
  new DataView(arrayBuffer).setUint8(0, bytesOfHeaders_unrequestingMessage);
  return arrayBuffer;
})();
binaryMessager.createHeaderOfResponse = createCreatingHeaderWithIdFn(bytesOfHeaders_response);

module.exports = binaryMessager;
