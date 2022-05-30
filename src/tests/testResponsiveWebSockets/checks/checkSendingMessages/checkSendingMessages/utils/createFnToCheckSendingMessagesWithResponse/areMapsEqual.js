"use strict";

const areMapsEqual = function(mapA, mapB, areValuesEqual) {
  if (mapA.size !== mapB.size) {
    return false;
  }
  for (const [keyA, valueA] of mapA.entries()) {
    const valueB = mapB.get(keyA);

    if (valueB === undefined) {
      return false;
    }
    if (valueA === valueB) {
      continue;
    }
    return false;
  }
  return true;
};

module.exports = areMapsEqual;
