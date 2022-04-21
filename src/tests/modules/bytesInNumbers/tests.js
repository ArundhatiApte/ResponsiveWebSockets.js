"use strict";

const expectEqual = require("assert").equal;

const {
  numberToInt32Bytes,
  int32BytesToNumber
} = require("./bytesInNumbers");

const test = function() {
  const integers = [1, 2, 3, 111];
  for (const int of integers) {
    checkCreatingBytesAndParsing(int);
  }
};

const checkCreatingBytesAndParsing = function(integer) {
  expectEqual(int32BytesToNumber(numberToInt32Bytes(integer), 0), integer);
};

describe("int32 in ArrayBuffer", test);
