"use strict";

const createArrayBufferFromUint8s = function(uint8s) {
  return new Uint8Array(uint8s).buffer;
};

module.exports = createArrayBufferFromUint8s;
