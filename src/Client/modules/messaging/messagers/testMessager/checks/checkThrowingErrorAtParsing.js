"use strict";

const expect = require("assert");
const ErrorAtParsing = require(
  "./../../../../../../common/ResponsiveWebSocketConnection/modules/messaging/ErrorAtParsing"
);

const checkThrowingErrorAtParsing = function(brokenMessage, parseMessage) {
  return expect.throws(parseMessage.bind(null, brokenMessage), ErrorAtParsing);
};

module.exports = checkThrowingErrorAtParsing;
