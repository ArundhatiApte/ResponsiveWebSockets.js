"use strict";

const expect = require("assert"),
      ExceptionAtParsing = require("./../../../../../../common/messaging/ExceptionAtParsing");

const checkThrowingExceptionAtParsing = function(brokenMessage, parseMessage) {
  return expect.throws(parseMessage.bind(null, brokenMessage), ExceptionAtParsing);
};

module.exports = checkThrowingExceptionAtParsing;
