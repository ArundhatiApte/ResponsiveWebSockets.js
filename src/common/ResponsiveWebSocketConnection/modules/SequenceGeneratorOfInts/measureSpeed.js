"use strict";

const SequenceGeneratorOfInts = require("./SequenceGeneratorOfInts");

const mesuteSpeedOfGeneratingInts = function(TypedArray, countOfInts) {
  const generatorOfInts = new SequenceGeneratorOfInts(TypedArray);
  const timeAtStart = Date.now();
  _generateInts(generatorOfInts, countOfInts);
  const timeAtEnd = Date.now();
  return timeAtEnd - timeAtStart;
};

const _generateInts = function(generatorOfInts, countOfInts) {
  let int;
  for (; countOfInts; ) {
    countOfInts -= 1;
    int = generatorOfInts.getNext();
    int = int >> 2;
  }
};

(function() {
  const timeMs = mesuteSpeedOfGeneratingInts(Uint16Array, 10_000_000_000);
  console.log("время: ", timeMs);
})();
