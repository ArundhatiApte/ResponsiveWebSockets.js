"use strict";

module.exports = {
  binaryMessager: require("./messagers/binaryMessager/binaryMessager"),
  textMessager: require("./messagers/textMessager/textMessager"),
  ExeptionAtParsing: require("./messagers/ExeptionAtParsing"),
  typesOfIncomingMessages: require("./messagers/typesOfIncomingMessages")
};
