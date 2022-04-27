"use strict";

const create = function(resolvePromise, timeoutToWait) {
  return {
    [nameOfPromiseResolver]: resolvePromise,
    [nameOfTimeout]: timeoutToWait
  };
};

const nameOfPromiseResolver = Symbol(),
      nameOfTimeout = Symbol();

module.exports = {
  create,
  nameOfPromiseResolver,
  nameOfTimeout
};
