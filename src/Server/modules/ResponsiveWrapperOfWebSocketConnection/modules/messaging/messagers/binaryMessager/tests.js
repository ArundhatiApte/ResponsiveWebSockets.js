"use strict";

const testMessager = require("./../testMessager");
const binaryMessager = require("./binaryMessager");

testMessager(describe, it, {
  nameOfTest: "test binary messager",
  messager: binaryMessager
});
