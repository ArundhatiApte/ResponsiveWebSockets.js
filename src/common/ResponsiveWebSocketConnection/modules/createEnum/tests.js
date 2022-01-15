"use strict";

const expect = require("assert"),
      createEnum = require("./createEnum");

const colors = createEnum("red", "green", "blue", "cyan");
expect.deepEqual(colors, {
  red: 1,
  green: 2,
  blue: 3,
  cyan: 4
});

console.log("Ok");
