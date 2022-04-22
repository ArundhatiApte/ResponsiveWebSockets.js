"use strict";

const { TimeoutToReceiveResponseError } = require("./../../../common/ResponsiveConnection/ResponsiveConnection");

const checkTimeout = async function(sender, reciever) {
  const msToWait = 100,
        message = new Uint8Array([2]).buffer,
        response = new Uint8Array([1]).buffer;

  let timeout;
  reciever.setBinaryRequestListener(function(message, startIdx, senderOfResponse) {
    timeout = setTimeout(() => {
      senderOfResponse.sendBinaryResponse(response);
    }, msToWait + 200);
  });

  try {
    const response = await sender.sendBinaryRequest(message, msToWait);
  } catch(error) {
    clearTimeout(timeout);
    if (error instanceof TimeoutToReceiveResponseError) {
      return;
    }
    throw error;
  }
  throw new Error("Response was received.");
};

module.exports = checkTimeout;