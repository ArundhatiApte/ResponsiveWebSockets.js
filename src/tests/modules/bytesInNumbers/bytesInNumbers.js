"use strict";

const numberToInt32Bytes = function(number) {
  const buffer = new ArrayBuffer(4);
  (new DataView(buffer)).setInt32(0, number);
  return buffer;
};

const int32BytesToNumber = function(arrayBuffer, startIndex = 0) {
  return (new DataView(arrayBuffer)).getInt32(startIndex);
};

module.exports = {
  numberToInt32Bytes,
  int32BytesToNumber
};
