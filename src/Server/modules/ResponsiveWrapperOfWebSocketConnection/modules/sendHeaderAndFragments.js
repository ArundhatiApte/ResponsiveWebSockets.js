"use strict";

const sendHeaderAndFragments = function(uWsWebSocket, isMessageBinary, header, fragments) {
  uWsWebSocket.sendFirstFragment(header);

  const lastIndex = fragments.length - 1;
  for (let i = 0; i < lastIndex; i += 1) {
    uWsWebSocket.sendFragment(fragments[i]);
  }
  uWsWebSocket.sendLastFragment(fragments[lastIndex]);
};

module.exports = sendHeaderAndFragments;
