"use strict";

const createArrayBufferFromUint8s = require("./../../utils/createArrayBufferFromUint8s");

module.exports = [
  createArrayBufferFromUint8s([1]),
  createArrayBufferFromUint8s([1, 9]),

  createArrayBufferFromUint8s([2]),
  createArrayBufferFromUint8s([2, 9]),

  createArrayBufferFromUint8s([13, 2, 1, 0, 2, 3])
];
