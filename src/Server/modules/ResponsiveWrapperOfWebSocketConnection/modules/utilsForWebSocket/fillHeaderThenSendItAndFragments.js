"use strict";

const sendHeaderAndFragments = require("./sendHeaderAndFragments");

const fillHeaderThenSendItAndFragments = function(
  uWsWebSocket,
  arrayBufferAsHeader,
  fillHeader,
  idOfMessage,
  isMessageBinary,
  fragments
) {
  fillHeader(arrayBufferAsHeader, idOfMessage);
  sendHeaderAndFragments(uWsWebSocket, arrayBufferAsHeader, isMessageBinary, fragments);
};

module.exports = fillHeaderThenSendItAndFragments;
