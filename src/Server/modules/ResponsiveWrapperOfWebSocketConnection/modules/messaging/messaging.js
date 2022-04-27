"use strict";

module.exports = {
  sizeOfRequestOrResponseHeader: 3,
  binaryMessager: require("./messagers/binaryMessager/binaryMessager"),
  textMessager: require("./messagers/textMessager/textMessager")
};
