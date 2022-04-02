"use strict";

const testMessager = require("./../testMessager");
const binaryMessager = require("./binaryMessager");

testMessager({
  nameOfTester: "test binary messager",
  messager: binaryMessager
});
