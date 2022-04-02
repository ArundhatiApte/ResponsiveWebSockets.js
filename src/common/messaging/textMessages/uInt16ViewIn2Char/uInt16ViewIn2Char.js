"use strict";

const stringFromCharCodes = String.fromCharCode;

const uInt16ToCharPlus2Chars8BitString = function(codeOfHeaderSymbol, uInt16) {
  const bytes = new Uint16Array([uInt16]).buffer;
  const uInt8s = new Uint8Array(bytes),
        firstByte = uInt8s[0],
        secondByte = uInt8s[1];
  return stringFromCharCodes(codeOfHeaderSymbol, firstByte, secondByte);
};

const extractUInt16FromStringUnsafe = function(startIndex, stringWithEnoughLength) {
  const indexOfSecondByte = startIndex + 1;
  const firstCharCode = stringWithEnoughLength.charCodeAt(startIndex),
        secondCharCode = stringWithEnoughLength.charCodeAt(indexOfSecondByte),
        bytes = new Uint8Array([firstCharCode, secondCharCode]).buffer;
  
  const out = new Uint16Array(bytes)[0];
  return out;
};

module.exports = {
  uInt16ToCharPlus2Chars8BitString,
  extractUInt16FromStringUnsafe
};
