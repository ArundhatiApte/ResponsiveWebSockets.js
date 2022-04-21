"use strict";

const testMessager = require("./../testMessager");
const textMessager = require("./textMessager");

testMessager(describe, it, {
  nameOfTest: "test text messager",
  messager: textMessager
});
