"use strict";

const expect = require("assert"),
      ExeptionAtParsing = require("./../../ExeptionAtParsing");

const createCheckingThrowingExeptionAtParsingFn = function(brokenMessage, parseMessage) {
  return function testThrowingExeptionAtParsing() {
    return expect.throws(parseMessage.bind(null, brokenMessage), ExeptionAtParsing);
  };
};

module.exports = createCheckingThrowingExeptionAtParsingFn;
