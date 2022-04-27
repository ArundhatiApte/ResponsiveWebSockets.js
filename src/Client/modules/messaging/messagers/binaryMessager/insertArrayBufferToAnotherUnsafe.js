"use strict";

const insertArrayBufferToAnotherUnsafe = function(sourceArrayBuffer, startIndexInSource, insertedArrayBuffer) {
  const sourceBytes = new Uint8Array(sourceArrayBuffer),
        insertedBytes = new Uint8Array(insertedArrayBuffer),
        countOfInsertedBytes = insertedBytes.length,
        afterLastIndex = startIndexInSource + countOfInsertedBytes - 1;

  let indexInSource = startIndexInSource,
      indexInInserted = 0;
  for (; indexInInserted < countOfInsertedBytes;) {
    sourceBytes[indexInSource] = insertedBytes[indexInInserted];
    indexInSource += 1;
    indexInInserted += 1;
  }
};

module.exports = insertArrayBufferToAnotherUnsafe;
