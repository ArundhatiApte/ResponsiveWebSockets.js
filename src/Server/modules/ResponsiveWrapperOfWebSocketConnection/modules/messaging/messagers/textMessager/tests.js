"use strict";

const clientMessager = require(
  "./../../../../../../../Client/modules/messaging/messagers/textMessager/textMessager"
);
const testMessager = require("./../testMessager/testMessager");
const textMessager = require("./textMessager");

const createCreatingHeaderFn = (function() {
  const _createHeader = function(fillBufferAsHeader, uint16Id) {
    const buffer = new ArrayBuffer(3);
    fillBufferAsHeader(buffer, uint16Id);
    return _decodeBytesToText(buffer);
  };

  const _decodeBytesToText = TextDecoder.prototype.decode.bind(new TextDecoder("utf-8"));

  return function(fillBufferAsHeader) {
    return _createHeader.bind(null, fillBufferAsHeader);
  };
})();

testMessager(describe, it, {
  nameOfTest: "server text messager",
  messager: {
    createHeaderOfRequest: createCreatingHeaderFn(textMessager.fillBufferAsHeaderOfRequest),
    createHeaderOfResponse: createCreatingHeaderFn(textMessager.fillBufferAsHeaderOfResponse),
    headerOfUnrequestingMessage: textMessager.headerOfUnrequestingMessage,

    extractTypeOfIncomingMessage: textMessager.extractTypeOfIncomingMessage,
    extractIdOfMessage: textMessager.extractIdOfMessage
  },
  client: {
    messager: clientMessager,
    message: "something"
  }
});
