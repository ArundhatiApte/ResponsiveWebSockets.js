"use strict";

const create = function(resolvePromise, timeoutToWait) {
  return [resolvePromise, timeoutToWait];
};

const nameOfPromiseResolver = 0,
      nameOfTimeout = 1;

module.exports = {
  create,
  nameOfPromiseResolver,
  nameOfTimeout
};
