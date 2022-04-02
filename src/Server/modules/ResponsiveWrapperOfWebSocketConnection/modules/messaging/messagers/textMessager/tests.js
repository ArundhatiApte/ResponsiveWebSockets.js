"use strict";

const testMessager = require("./../testMessager");
const textMessager = require("./textMessager");

testMessager({
  nameOfTester: "test text messager",
  messager: textMessager
});
