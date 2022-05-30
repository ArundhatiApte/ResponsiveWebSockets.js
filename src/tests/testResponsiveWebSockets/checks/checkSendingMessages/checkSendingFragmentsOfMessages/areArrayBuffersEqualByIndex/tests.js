"use strict";

const expectEqual = require("assert").strictEqual;

const creatArrayBufferFromUint8s = require("./../../utils/createArrayBufferFromUint8s");
const areArrayBuffersEqualByIndex = require("./areArrayBuffersEqualByIndex");

const createFnToCheckComparingArrayBuffersByIndex = (function() {
  const createFnToCheckComparingArrayBuffersByIndex = function(
    aUint8s,
    startIndexInA,
    bUint8s,
    startIndexInB,
    areEqual
  ) {
    return _checkComparingArrayBuffersByIndex.bind(
      null,
      aUint8s,
      startIndexInA,
      bUint8s,
      startIndexInB,
      areEqual
    );
  };

  const _checkComparingArrayBuffersByIndex = function(
    aUint8s,
    startIndexInA,
    bUint8s,
    startIndexInB,
    areEqual
  ) {
    const result = areArrayBuffersEqualByIndex(
      creatArrayBufferFromUint8s(aUint8s),
      startIndexInA,
      creatArrayBufferFromUint8s(bUint8s),
      startIndexInB
    );
    expectEqual(areEqual, result);
  };

  return createFnToCheckComparingArrayBuffersByIndex;
})();

describe("comparing byte arrays by index", function() {
  it("equal", createFnToCheckComparingArrayBuffersByIndex(
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    2,
    [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    4,
    true
  ));
  it("different (content)", createFnToCheckComparingArrayBuffersByIndex(
    [1, 2, 3, 4],
    1,
    [0, 1, 2, 3, 5],
    2,
    false
  ));
  it("different (size)", createFnToCheckComparingArrayBuffersByIndex(
    [1, 2, 3, 4],
    1,
    [0, 1, 2, 3, 4, 5],
    2,
    false
  ));
});
