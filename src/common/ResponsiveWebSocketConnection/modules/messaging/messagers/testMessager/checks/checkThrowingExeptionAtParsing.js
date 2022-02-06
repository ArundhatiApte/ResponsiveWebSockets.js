"use strict";

const expect = require("assert"),
      ExeptionAtParsing = require("./../../ExeptionAtParsing");

const checkThrowingExeptionAtParsing = function(brokenMessage, parseMessage) {
  return expect.throws(parseMessage.bind(null, brokenMessage), ExeptionAtParsing);
};

module.exports = checkThrowingExeptionAtParsing;
