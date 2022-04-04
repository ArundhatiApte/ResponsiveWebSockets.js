"use strict";

const areByteArraysEqual = function(arrayBufferA, startIndexInB, arrayBufferB) {
  const aLen = arrayBufferA.byteLength;
  if (aLen !== (arrayBufferB.byteLength - startIndexInB)) {
    return false;
  }
  const aBytes = new Uint8Array(arrayBufferA);
  const bBytes = new Uint8Array(arrayBufferB);
  let aByte, bByte;

  for (let indexInA = 0, indexInB = startIndexInB; indexInA < aLen; indexInA += 1, indexInB += 1) {
    aByte = aBytes[indexInA];
    bByte = bBytes[indexInB];
    
    if (aByte !== bByte) {
      return false;
    }
  }
  return true;
};

module.exports = areByteArraysEqual;
