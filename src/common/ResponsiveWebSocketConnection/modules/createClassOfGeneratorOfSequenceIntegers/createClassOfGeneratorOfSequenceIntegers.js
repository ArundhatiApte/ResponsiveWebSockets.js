"use strict";

const createClassOfGeneratorOfSequenceIntegers = function(TypedArray) {
  return class {
    constructor() {
      this[_numbers] = new TypedArray(1);
    }

    getNext() {
      return this[_numbers][0]++; //not this[_numbers][0] += 1
      //const numbers = this[_numbers];
      //numbers[0] += 1;
      //return numbers[0];
    }
  };
};

const _numbers = "_";

module.exports = createClassOfGeneratorOfSequenceIntegers;
