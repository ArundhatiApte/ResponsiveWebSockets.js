"use strict";

const expectEqual = require("assert").equal;

const {
  uint16ToCharPlus2Chars8BitString,
  extractUint16FromStringUnsafe
} = require("./uint16ViewIn2Char");

const test = function() {
  const maxNumberPlus1 = Math.pow(2, 16);
  const prefix = "[--]";
  const prefixLength = prefix.length;

  for (let i = 0; i < maxNumberPlus1; i += 1) {
    checkCreatingAndParsingString(i, prefix, prefixLength);
  }
};

const checkCreatingAndParsingString = function(uint16, prefix, prefixLength) {
  const codeOfFirstSymbol = 42;
  const startIndex = prefixLength+ 1;

  const string = prefix + uint16ToCharPlus2Chars8BitString(codeOfFirstSymbol, uint16);
  const number = extractUint16FromStringUnsafe(startIndex, string);

  if (number === null) {
    throw new Error("Cant parse view of " + uint16);
  }
  expectEqual(uint16, number);
};

describe("uint16ViewIn2Char", function() {
  it("pack and unpack uint16 to/from 2 8bit char string", test);
});
