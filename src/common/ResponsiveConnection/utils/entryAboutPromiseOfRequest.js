"use strict";

const create = function(resolvePromise, timeoutToWait) {
  return {
    a: resolvePromise,
    b: timeoutToWait
  };
};

const nameOfPromiseResolver = "a",
      nameOfTimeout = "b";

module.exports = {
  create,
  nameOfPromiseResolver,
  nameOfTimeout
};
