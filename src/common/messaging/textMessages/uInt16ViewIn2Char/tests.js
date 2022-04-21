"use strict";

const expectEqual = require("assert").equal;

const {
  uInt16ToCharPlus2Chars8BitString,
  extractUInt16FromStringUnsafe
} = require("./uInt16ViewIn2Char");

const test = function() {
  const maxNumber = Math.pow(2, 16);
  for (let i = 0; i < maxNumber; i += 1) {
    checkCreatingAndParsingString(i);
  }
};

const checkCreatingAndParsingString = function(uInt16) {
  const prefix = "zzpr",
        codeOfFirstSymbol = 42,
        startIndex = prefix.length + 1,
        string = prefix + uInt16ToCharPlus2Chars8BitString(codeOfFirstSymbol, uInt16),
        number = extractUInt16FromStringUnsafe(startIndex, string);

  if (number === null) {
    throw new Error("Cant parse view of " + uInt16);
  }
  expectEqual(uInt16, number);
};

describe("uInt16ViewIn2Char", function() {
  it("pack and unpack uint16 to/from 2 8bit char string", test);
});
