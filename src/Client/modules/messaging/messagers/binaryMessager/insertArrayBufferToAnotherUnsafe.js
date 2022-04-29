"use strict";

const insertArrayBufferToAnotherUnsafe = function(sourceArrayBuffer, startIndexInSource, insertedArrayBuffer) {
  const sourceData = new DataView(sourceArrayBuffer);
  const insertedData = new DataView(insertedArrayBuffer);
  const countOfInsertedBytes = insertedArrayBuffer.byteLength;

  let indexInSource = startIndexInSource;
  let indexInInserted = 0;

  for (; indexInInserted < countOfInsertedBytes;) {
    sourceData.setUint8(indexInSource, insertedData.getUint8(indexInInserted));
    indexInSource += 1;
    indexInInserted += 1;
  }
};

module.exports = insertArrayBufferToAnotherUnsafe;
