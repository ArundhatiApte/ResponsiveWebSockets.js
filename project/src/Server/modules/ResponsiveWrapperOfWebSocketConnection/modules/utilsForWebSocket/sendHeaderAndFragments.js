"use strict";

const sendHeaderAndFragments = function(uWsWebSocket, binaryHeader, isMessageBinary, fragments) {
  uWsWebSocket.sendFirstFragment(binaryHeader, isMessageBinary); // ok

  const lastIndex = fragments.length - 1;
  for (let i = 0; i < lastIndex; i += 1) {
    uWsWebSocket.sendFragment(fragments[i], isMessageBinary);
  }
  uWsWebSocket.sendLastFragment(fragments[lastIndex], isMessageBinary);
};

module.exports = sendHeaderAndFragments;
