"use strict";

const { TimeoutToReceiveResponseError } = require(
  "./../../../../../common/ResponsiveWebSocketConnection/ResponsiveWebSocketConnection"
);

const createFnToCheckTimeoutForReceivingResponse = function(sendRequest, sendResponse) {
  return _checkTimeoutForReceivingResponse.bind(null, sendRequest, sendResponse);
};

const _checkTimeoutForReceivingResponse = async function(sendRequest, sendResponse, sender, receiver) {
  const msToWait = 100;
  let timeout;
  receiver.setBinaryRequestListener(function(message, startIndex, senderOfResponse) {
    timeout = setTimeout(sendResponse.bind(null, receiver, senderOfResponse), msToWait + 200);
  });

  try {
    const response = await sendRequest(sender, msToWait);
  } catch(error) {
    clearTimeout(timeout);
    if (error instanceof TimeoutToReceiveResponseError) {
      return;
    }
    throw error;
  }
  throw new Error("Response was received.");
};

module.exports = createFnToCheckTimeoutForReceivingResponse;
