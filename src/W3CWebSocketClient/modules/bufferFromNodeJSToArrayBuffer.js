"use strict";

const bufferFromNodeJSToArrayBuffer = function(buffer) {
  const countOfByties = buffer.length,
        arrayBuffer = new ArrayBuffer(countOfByties),
        uInt8s = new Uint8Array(arrayBuffer);
  for (let i = 0; i < countOfByties; i += 1) {
    uInt8s[i] = buffer[i];
  }
  return arrayBuffer;
}; 

module.exports = bufferFromNodeJSToArrayBuffer;
