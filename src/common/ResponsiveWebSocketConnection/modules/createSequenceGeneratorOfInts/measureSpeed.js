"use strict";

const createSequenceGeneratorOfInts = require("./createSequenceGeneratorOfInts");

const mesuteSpeedOfGeneratingInts = function(TypedArray, countOfInts) {
  const getNextInt = createSequenceGeneratorOfInts(TypedArray);
  const timeAtStart = Date.now();
  _generateInts(getNextInt, countOfInts);
  const timeAtEnd = Date.now();
  return timeAtEnd - timeAtStart;
};

const _generateInts = function(getNextInt, countOfInts) {
  let int;
  for (; countOfInts; ) {
    countOfInts -= 1;
    int = getNextInt();
    int = int >> 2;
  }
};

(function() {
  const timeMs = mesuteSpeedOfGeneratingInts(Uint16Array, 10_000_000_000);
  console.log("время: ", timeMs);
})();
