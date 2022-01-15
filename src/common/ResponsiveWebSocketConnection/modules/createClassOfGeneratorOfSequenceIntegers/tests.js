"use strict";

const expect = require("assert"),
      createClassOfGeneratorOfSequenceIntegers = require("./createClassOfGeneratorOfSequenceIntegers");

const test = function() {
  const maxNumber = 255,
        GeneratorOfNums = createClassOfGeneratorOfSequenceIntegers(Uint8Array),
        generator = new GeneratorOfNums();

  let prevNum = -1,
      currentNum;
      
  for (let i = 0; i < 256; i += 1) {
    currentNum = generator.getNext();
    expect.equal(prevNum + 1, currentNum);
    prevNum = currentNum;
  }

  currentNum = generator.getNext();
  expect.equal(0, currentNum);

  console.log("Ok");
};

test();
