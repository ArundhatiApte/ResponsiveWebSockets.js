"use strict";

const testMessager = require("./../testMessager");
const binaryMessager = require("./binaryMessager");

testMessager(describe, it, {
  nameOfTest: "server binary messager",
  messager: binaryMessager
});
