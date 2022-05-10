"use strict";

const SequenceGeneratorOfInts = class {
  constructor(TypedArray) {
    this[_numbers] = new TypedArray(1);
  }

  getNext() {
    return this[_numbers][0]++; //not this[_numbers][0] += 1
  }
};

const _numbers = "_";

module.exports = SequenceGeneratorOfInts;
