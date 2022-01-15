"use strict";

module.exports = {
  binaryMessager: require("./messagers/binaryMessager"),
  textMessager: require("./messagers/textMessager"),
  ExeptionAtParsing: require("./messagers/ExeptionAtParsing"),
  typesOfIncomingMessages: require("./messagers/typesOfIncomingMessages")
};
