"use strict";

const createTimeoutForPromise = function(rejectPromise, timeMs) {
  return setTimeout(function() {
    return rejectPromise(new Error("Время на тест вышло."));
  }, timeMs);
};

module.exports = createTimeoutForPromise;
