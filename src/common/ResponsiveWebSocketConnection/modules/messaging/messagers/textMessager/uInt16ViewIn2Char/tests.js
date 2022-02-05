"use strict";

const expectEqual = require("assert").equal;

const {
  uInt16ToCharPlus2Chars8BitString,
  extractUInt16FromString
} = require("./uInt16ViewIn2Char");

const test = function() {
  const maxNumber = Math.pow(2, 16);
  for (let i = 0; i < maxNumber; i += 1) {
    checkCreatingAndParsingString(i);  
  }
  
  console.log("Ok");
};

const checkCreatingAndParsingString = function(uInt16) {
  const prefix = "zzpr",
        codeOfFirstSymbol = 42,
        startIndex = prefix.length + 1,
        string = prefix + uInt16ToCharPlus2Chars8BitString(codeOfFirstSymbol, uInt16),
        number = extractUInt16FromString(startIndex, string);

  if (number === null) {
    throw new Error("Cant parse view of " + uInt16);
  }
  expectEqual(uInt16, number);
};

test();
