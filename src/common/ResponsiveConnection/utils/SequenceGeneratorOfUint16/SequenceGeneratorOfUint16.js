"use strict";

const SequenceGeneratorOfUint16 = class {
  constructor() {
    this[_numbers] = new Uint16Array(1);
  }

  getNext() {
    return this[_numbers][0]++; //not this[_numbers][0] += 1
  }
};

const _numbers = "_";

module.exports = SequenceGeneratorOfUint16;
