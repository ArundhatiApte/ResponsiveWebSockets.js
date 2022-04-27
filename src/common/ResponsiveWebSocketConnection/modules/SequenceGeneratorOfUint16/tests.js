"use strict";

const expectEqual = require("assert").strictEqual;
const SequenceGeneratorOfUint16 = require("./SequenceGeneratorOfUint16");

const test = function() {
  const maxNumberPlus1 = Math.pow(2, 16),
        generator = new SequenceGeneratorOfUint16();

  let prevNum = -1,
      currentNum;

  for (let i = 0; i < maxNumberPlus1; i += 1) {
    currentNum = generator.getNext();
    expectEqual(prevNum + 1, currentNum);
    prevNum = currentNum;
  }

  currentNum = generator.getNext();
  expectEqual(0, currentNum);
};

describe("SequenceGeneratorOfUint16", function() {
  it("generate numbers", test);
});
