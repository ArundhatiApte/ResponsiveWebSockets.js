"use strict";

const clientMessager = require(
  "./../../../../../../../Client/modules/messaging/messagers/binaryMessager/binaryMessager"
);
const testMessager = require("./../testMessager/testMessager");
const binaryMessager = require("./binaryMessager");

const createCreatingHeaderFn = function(fillBufferAsHeader) {
  return function(uint16Id) {
    const buffer = new ArrayBuffer(3);
    fillBufferAsHeader(buffer, uint16Id);
    return buffer;
  };
};

testMessager(describe, it, {
  nameOfTest: "server binary messager",
  messager: {
    createHeaderOfRequest: createCreatingHeaderFn(binaryMessager.fillBufferAsHeaderOfRequest),
    createHeaderOfResponse: createCreatingHeaderFn(binaryMessager.fillBufferAsHeaderOfResponse),
    headerOfUnrequestingMessage: binaryMessager.headerOfUnrequestingMessage,

    extractTypeOfIncomingMessage: binaryMessager.extractTypeOfIncomingMessage,
    extractIdOfMessage: binaryMessager.extractIdOfMessage
  },
  client: {
    messager: clientMessager,
    message: new Uint8Array([97, 98, 99, 100]).buffer
  }
});
