"use strict";

const {
  labels: {
    direction: {
      fromServerToClient,
      fromClientToServer
    },
    contentType: {
      binary,
      text
    }
  },
  writeHeader,
  writeRowWithResult
} = require("./utils/logger");

const measureSpeedOfSendingRequests = require("./utils/measureSpeedOfSendingRequests");

const measureSpeedOfSendingRequestsAndLogResults = async function(
  connectionToClient,
  client,
  countOfRequests,
  writableStream
) {
  writeHeader(writableStream, countOfRequests);

  const nameOfSendingBinaryRequestMethod = "sendBinaryRequest";
  const nameOfSettingListenerOfBinaryRequestMethod = "setBinaryRequestListener";
  const nameOfSendingBinaryResponseMethod = "sendBinaryResponse";

  const cases = [
    [
      binary,
      fromServerToClient,
      connectionToClient,
      client,
      nameOfSendingBinaryRequestMethod,
      createBinaryMessageByNumberOfRequestAtServer,
      nameOfSettingListenerOfBinaryRequestMethod,
      nameOfSendingBinaryResponseMethod,
      createBinaryResponse
    ],
    [
      binary,
      fromClientToServer,
      client,
      connectionToClient,
      nameOfSendingBinaryRequestMethod,
      createBinaryMessageByNumberOfRequestAtClient,
      nameOfSettingListenerOfBinaryRequestMethod,
      nameOfSendingBinaryResponseMethod,
      createBinaryResponse
    ]
  ];

  for (const entry of cases) {
    const [
      labelOfContentType,
      labelOfDirection,
      sender,
      receiver,
      nameOfSendingRequestMethod,
      createMessageByNumberOfRequest,
      nameOfSettingListenerOfRequestMethod,
      nameOfSendingResponseMethod,
      createResponse
    ] = entry;

    await _measureSpeedOfSendingRequestsAndLogResult(
      sender,
      receiver,
      countOfRequests,
      nameOfSendingRequestMethod,
      createMessageByNumberOfRequest,
      nameOfSettingListenerOfRequestMethod,
      nameOfSendingResponseMethod,
      createResponse,
      writableStream,
      labelOfContentType,
      labelOfDirection,
    );
  }
};

const createBinaryMessageByNumberOfRequestAtServer = function(sender, number) {
  number += 1;
  return new Uint8Array([number, number * 2, number * 4, number * 8]);
};

const createBinaryMessageByNumberOfRequestAtClient = function(sender, number) {
  number += 1;
  const sizeOfHeader = sender.sizeOfHeaderForBinaryRequest;
  const out = new ArrayBuffer(sizeOfHeader + 4);

  const uint8s = new Uint8Array(out);
  uint8s[sizeOfHeader] = number;
  uint8s[sizeOfHeader + 1] = number * 2;
  uint8s[sizeOfHeader + 2] = number * 4;
  uint8s[sizeOfHeader + 3] = number * 8;

  return out;
};

const createBinaryResponse = (message) => message;

const _measureSpeedOfSendingRequestsAndLogResult = async function(
  sender,
  receiver,
  countOfRequests,
  nameOfSendingRequestMethod,
  createMessageByNumberOfRequest,
  nameOfSettingListenerOfRequestMethod,
  nameOfSendingResponseMethod,
  createResponse,
  writableStream,
  labelOfContentType,
  labelOfDirection,
) {
  const timeMs = await measureSpeedOfSendingRequests(
    sender,
    receiver,
    countOfRequests,
    nameOfSendingRequestMethod,
    nameOfSettingListenerOfRequestMethod,
    createMessageByNumberOfRequest,
    createResponse,
    nameOfSendingResponseMethod
  );
  writeRowWithResult(writableStream, labelOfContentType, labelOfDirection, timeMs);
};

module.exports = measureSpeedOfSendingRequestsAndLogResults;
