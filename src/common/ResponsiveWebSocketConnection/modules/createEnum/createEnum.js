"use strict";

const createEnum = function() {
  const out = Object.create(null);
  let countOfNames = arguments.length,
      name;

  for (;countOfNames;) {
    countOfNames -= 1;
    name = arguments[countOfNames];
    out[name] = countOfNames + 1;
  }
  return Object.freeze(out);
};

module.exports = createEnum;
