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
  fillHeader(idOfMessage, arrayBufferAsHeader);
  sendHeaderAndFragments(uWsWebSocket, arrayBufferAsHeader, isMessageBinary, fragments);
};

module.exports = fillHeaderThenSendItAndFragments;
