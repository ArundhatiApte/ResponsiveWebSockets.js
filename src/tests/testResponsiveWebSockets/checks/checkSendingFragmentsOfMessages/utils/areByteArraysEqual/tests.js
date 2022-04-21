"use strict";

const expectEqual = require("assert").strictEqual;
const Tester = require("tester");

const createByteArray = require("./../createByteArray");
const areByteArraysEqual = require("./areByteArraysEqual");
      
const tester = new Tester("test comparing byte arrays");

const createTest = (function() {
  const createTest = function(uint8sAToStartIndexInBAndUint8sB, areEqual) {
    return _executeTest.bind(null, uint8sAToStartIndexInBAndUint8sB, areEqual);
  };

  const _executeTest = function(uint8sAToStartIndexInBAndUint8sB, areEqual) {
    for (const [uint8sA, startIndexInB, uint8sB] of uint8sAToStartIndexInBAndUint8sB) {
      _checkComparingByteArrays(uint8sA, startIndexInB, uint8sB, areEqual);
    }
  };

  const _checkComparingByteArrays = function(uint8sA, startIndexInB, uint8sB, areEqual) {
    return expectEqual(areEqual, areByteArraysEqual(
      createByteArray(uint8sA),
      startIndexInB,
      createByteArray(uint8sB)
    ));
  };

  return createTest;
})();


tester.addTest(createTest([
  [[3, 4, 5, 6, 7, 8], 2, [1, 2, 3, 4, 5, 6, 7, 8]],
  [[1, 2, 3, 4], 0, [1, 2, 3, 4]],
  [[4], 3, [1, 2, 3, 4]]
], true), {name: "test equal"});

tester.addTest(createTest([
  [[5, 6, 8, 8], 4, [1, 2, 3, 4, 5, 6, 7, 8]],
  [[1, 2, 3, 5], 0, [1, 2, 3, 4]],
  [[5], 3, [1, 2, 3, 4]]
], false), {name: "test different"});

tester.run();
