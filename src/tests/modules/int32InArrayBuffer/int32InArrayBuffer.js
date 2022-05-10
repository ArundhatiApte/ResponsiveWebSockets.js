"use strict";

const isLittleEndian = require(
  "./../../../common/ResponsiveWebSocketConnection/modules/messaging/binaryMessages/isLittleEndian"
);

const int32ToBytes = function(sizeOfHeader, number) {
  const buffer = new ArrayBuffer(sizeOfHeader + 4);
  (new DataView(buffer)).setInt32(sizeOfHeader, number, isLittleEndian);
  return buffer;
};

const bytesToInt32 = function(arrayBuffer, startIndex = 0) {
  return (new DataView(arrayBuffer)).getInt32(startIndex, isLittleEndian);
};

module.exports = {
  int32ToBytes,
  bytesToInt32
};
