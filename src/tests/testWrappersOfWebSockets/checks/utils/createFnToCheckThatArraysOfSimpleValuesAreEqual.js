"use strict";

const areArraysOfSimpleValuesEqual = function(aElements, bElements, compareElements) {
  let aCount = aElements.length;
  if (aCount !== bElements.length) {
    return false;
  }
  aElements = getSortedElements(aElements, compareElements);
  bElements = getSortedElements(bElements, compareElements);

  let aElement, bElement;
  for (;aCount;) {
    aCount -= 1;
    aElement = aElements[aCount];
    bElement = bElements[aCount];

    if (aElement === bElement) {
      continue;
    }
    return false;
  }
  return true;
};

const getSortedElements = function(elements, compareElements) {
  return elements.slice().sort(compareElements);
};

const createFnToCheckThatArraysOfSimpleValuesAreEqual = function(
  compareElements
) {
  return function(aElements, bElements) {
    return areArraysOfSimpleValuesEqual(aElements, bElements, compareElements);
  };
};

module.exports = createFnToCheckThatArraysOfSimpleValuesAreEqual;
