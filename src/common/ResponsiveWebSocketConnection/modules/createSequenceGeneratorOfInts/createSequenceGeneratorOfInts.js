"use strict";

const createSequenceGeneratorOfInts = function(TypedArray) {
  return _getNextIntFromTypedArray.bind(new TypedArray(1));
};

const _getNextIntFromTypedArray = function() {
  return this[0]++;
};

module.exports = createSequenceGeneratorOfInts;
