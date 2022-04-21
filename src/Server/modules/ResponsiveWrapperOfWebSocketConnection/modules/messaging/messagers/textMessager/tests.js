"use strict";

const testMessager = require("./../testMessager");
const textMessager = require("./textMessager");

testMessager(describe, it, {
  nameOfTest: "server text messager",
  messager: textMessager
});
