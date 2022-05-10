"use strict";

const expectEqual = require("assert").strictEqual;
const SequenceGeneratorOfInts = require("./SequenceGeneratorOfInts");

const test = function() {
  const maxNumberPlus1 = Math.pow(2, 16);
  const generator = new SequenceGeneratorOfInts(Uint16Array);

  let prevNum = -1;
  let currentNum;

  for (let i = 0; i < maxNumberPlus1; i += 1) {
    currentNum = generator.getNext();
    expectEqual(prevNum + 1, currentNum);
    prevNum = currentNum;
  }

  currentNum = generator.getNext();
  expectEqual(0, currentNum);
};

describe("SequenceGeneratorOfInts", function() {
  it("generate numbers", test);
});
