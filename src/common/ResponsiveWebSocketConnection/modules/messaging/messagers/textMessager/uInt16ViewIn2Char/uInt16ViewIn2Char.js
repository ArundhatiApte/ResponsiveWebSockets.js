"use strict";

const stringFromCharCodes = String.fromCharCode;

const uInt16To2Chars8BitString = function(uInt16) {
  const bytes = new Uint16Array([uInt16]).buffer;
  const uInt8s = new Uint8Array(bytes),
        firstByte = uInt8s[0],
        secondByte = uInt8s[1];
  return stringFromCharCodes(firstByte, secondByte);
};

const extractUInt16FromString = function(startIndex, string) {
  const indexOfSecondByte = startIndex + 1;
  if (string.length <= indexOfSecondByte) {
    return null;
  }
  const firstCharCode = string.charCodeAt(startIndex),
        secondCharCode = string.charCodeAt(indexOfSecondByte),
        bytes = new Uint8Array([firstCharCode, secondCharCode]).buffer;
  
  const out = new Uint16Array(bytes)[0];
  return out;
};

module.exports = {
  uInt16To2Chars8BitString,
  extractUInt16FromString
};
