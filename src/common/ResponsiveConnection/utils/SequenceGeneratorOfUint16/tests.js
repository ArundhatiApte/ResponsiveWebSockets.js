"use strict";

const expect = require("assert"),
      SequenceGeneratorOfUint16 = require("./SequenceGeneratorOfUint16");

const test = function() {
  const maxNumberPlus1 = Math.pow(2, 16),
        generator = new SequenceGeneratorOfUint16();

  let prevNum = -1,
      currentNum;
      
  for (let i = 0; i < maxNumberPlus1; i += 1) {
    currentNum = generator.getNext();
    expect.equal(prevNum + 1, currentNum);
    prevNum = currentNum;
  }

  currentNum = generator.getNext();
  expect.equal(0, currentNum);

  console.log("Ok");
};

test();
