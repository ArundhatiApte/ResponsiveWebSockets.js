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

  const nameOfSendingBinaryRequestMethod = "sendBinaryRequest",
        nameOfSendingTextRequestMethod = "sendTextRequest";

  const nameOfSettingListenerOfBinaryRequestMethod = "setBinaryRequestListener",
        nameOfSettingListenerOfTextRequestMethod = "setTextRequestListener";

  const nameOfSendingBinaryResponseMethod = "sendBinaryResponse",
        nameOfSendingTextResponseMethod = "sendTextResponse";

  const cases = [
    [
      binary,
      fromServerToClient,
      connectionToClient,
      client,
      nameOfSendingBinaryRequestMethod,
      createBinaryMessageByNumberOfRequest,
      nameOfSettingListenerOfBinaryRequestMethod,
      nameOfSendingBinaryResponseMethod,
      createBinaryResponse
    ],
    [
      text,
      fromServerToClient,
      connectionToClient,
      client,
      nameOfSendingTextRequestMethod,
      createTextMessageByNumberOfRequest,
      nameOfSettingListenerOfTextRequestMethod,
      nameOfSendingTextResponseMethod,
      createTextResponse
    ],
    [
      binary,
      fromClientToServer,
      client,
      connectionToClient,
      nameOfSendingBinaryRequestMethod,
      createBinaryMessageByNumberOfRequest,
      nameOfSettingListenerOfBinaryRequestMethod,
      nameOfSendingBinaryResponseMethod,
      createBinaryResponse
    ],
    [
      text,
      fromClientToServer,
      client,
      connectionToClient,
      nameOfSendingTextRequestMethod,
      createTextMessageByNumberOfRequest,
      nameOfSettingListenerOfTextRequestMethod,
      nameOfSendingTextResponseMethod,
      createTextResponse
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

const createBinaryMessageByNumberOfRequest = function(n) {
  n += 1;
  return new Uint8Array([n, n * 2, n * 4, n * 8]);
};
const createBinaryResponse = (message) => message;
const createTextResponse = createBinaryResponse;

const createTextMessageByNumberOfRequest = function(n) {
  n += 1;
  return stringFromCharCodes(n, n * 2, n * 4, n * 8);
};
const stringFromCharCodes = String.fromCharCode;

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
