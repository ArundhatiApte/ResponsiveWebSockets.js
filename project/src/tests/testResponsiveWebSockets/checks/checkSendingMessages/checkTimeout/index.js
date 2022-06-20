"use strict";

const createFnToCheckTimeoutForReceivingResponse = require("./_createFnToCheckTimeoutForReceivingResponse");

const checkTimeoutByServer = createFnToCheckTimeoutForReceivingResponse(
  function sendRequestFromServer(connection, maxTimeMsToWait) {
    return connection.sendBinaryRequest(new ArrayBuffer(4), maxTimeMsToWait);
  },
  function sendResponseFromClient(client, senderOfResponse) {
    return senderOfResponse.sendBinaryResponse(new ArrayBuffer(client.sizeOfHeaderForBinaryResponse + 1));
  }
);

const checkTimeoutByClient = createFnToCheckTimeoutForReceivingResponse(
  function sendRequestFromClient(client, maxTimeMsToWait) {
    return client.sendBinaryRequest(new ArrayBuffer(client.sizeOfHeaderForBinaryRequest + 4), maxTimeMsToWait);
  },
  function sendResponseFromServer(_, senderOfResponse) {
    return senderOfResponse.sendBinaryResponse(new ArrayBuffer(1));
  }
);
module.exports = {
  checkTimeoutByServer,
  checkTimeoutByClient
};
