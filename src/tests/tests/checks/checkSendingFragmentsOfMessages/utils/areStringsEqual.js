"use strict";

const areStringsEqual = function(a, startIndexInB, b) {
  return a === b.slice(startIndexInB);
};

module.exports = areStringsEqual;
