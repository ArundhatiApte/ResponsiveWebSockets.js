"use strict";

const stringFromCharCodes = String.fromCharCode;
const stringFromCodePoints = String.fromCodePoint;

const uint16ToCharPlus2Chars8BitString = function(codeOfHeaderSymbol, uint16InUint32) {
  const firstByte = (uint16InUint32 << 16) >>> 24;
  const secondByte = uint16InUint32 & 0b1111_1111;

  return stringFromCodePoints(codeOfHeaderSymbol, firstByte, secondByte);
};

const extractUint16FromStringUnsafe = function(startIndex, stringWithEnoughLength) {
  const firstCharCode = stringWithEnoughLength.codePointAt(startIndex);
  const secondCharCode = stringWithEnoughLength.codePointAt(startIndex + 1);
  return (firstCharCode << 8) | secondCharCode;
};

module.exports = {
  uint16ToCharPlus2Chars8BitString,
  extractUint16FromStringUnsafe
};
