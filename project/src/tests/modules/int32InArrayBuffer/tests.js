"use strict";

const expectEqual = require("assert").strictEqual;

const {
  int32ToBytes,
  bytesToInt32
} = require("./int32InArrayBuffer");

const test = function() {
  const integers = [0, 1, 2, -12345678, 12345678];
  for (const int of integers) {
    checkCreatingBytesAndParsing(int);
  }
};

const checkCreatingBytesAndParsing = function(integer) {
  return expectEqual(bytesToInt32(int32ToBytes(0, integer), 0), integer);
};

describe("int32 in ArrayBuffer", function() {
  it("test", test);
});
