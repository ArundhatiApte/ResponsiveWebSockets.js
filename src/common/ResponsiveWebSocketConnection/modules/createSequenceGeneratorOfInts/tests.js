"use strict";

const expectEqual = require("assert").strictEqual;
const createSequenceGeneratorOfInts = require("./createSequenceGeneratorOfInts");

const test = function() {
  const maxNumberPlus1 = Math.pow(2, 16);
  const getNextInt = createSequenceGeneratorOfInts(Uint16Array);

  let prevNum = -1;
  let currentNum;

  for (let i = 0; i < maxNumberPlus1; i += 1) {
    currentNum = getNextInt();
    expectEqual(prevNum + 1, currentNum);
    prevNum = currentNum;
  }

  currentNum = getNextInt();
  expectEqual(0, currentNum);
};

describe("createSequenceGeneratorOfInts", function() {
  it("generate numbers", test);
});
