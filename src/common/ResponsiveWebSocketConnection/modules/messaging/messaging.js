"use strict";

module.exports = {
  binaryMessager: require("./messagers/binaryMessager/binaryMessager"),
  textMessager: require("./messagers/textMessager/textMessager"),
  ExceptionAtParsing: require("./messagers/ExceptionAtParsing"),
  typesOfIncomingMessages: require("./messagers/typesOfIncomingMessages")
};
