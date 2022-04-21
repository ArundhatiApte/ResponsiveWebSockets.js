"use strict";

const createByteArray = function(uint8s) {
  return new Uint8Array(uint8s).buffer;
};

module.exports = createByteArray;
