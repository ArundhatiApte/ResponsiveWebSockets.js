"use strict";

const measureSpeedOfSendingRequests = async function(
  sender,
  receiver,
  countOfRequests,
  nameOfSendingRequestMethod,
  nameOfSettingListenerOfRequestMethod,
  createMessageByNumberOfRequest,
  createResponse,
  nameOfSendingResponseMethod
) {

  const timeOfStart = Date.now();
  await sendNRequestsAndReceiveAllResponses(
    sender,
    receiver,
    countOfRequests,
    nameOfSendingRequestMethod,
    nameOfSettingListenerOfRequestMethod,
    createMessageByNumberOfRequest,
    createResponse,
    nameOfSendingResponseMethod
  );
  const timeOfEnd = Date.now();
  return timeOfEnd - timeOfStart;
};

const maxCountOfRequestsAtOnce = Math.pow(2, 16) - 1;

const sendNRequestsAndReceiveAllResponses = async function(
  sender,
  receiver,
  countOfRequests,
  nameOfSendingRequestMethod,
  nameOfSettingListenerOfRequestMethod,
  createMessageByNumberOfRequest,
  createResponse,
  nameOfSendingResponseMethod
) {
  const listener = sendResponse.bind(null, createResponse, nameOfSendingResponseMethod);
  receiver[nameOfSettingListenerOfRequestMethod](listener);

  let countOfSendedRequests = 0;
  while (countOfRequests > 0) {
    if (countOfRequests > maxCountOfRequestsAtOnce) {
      countOfSendedRequests = maxCountOfRequestsAtOnce;
      countOfRequests -= maxCountOfRequestsAtOnce;
      await sendRequestsAndReceiveAllResponses(
        sender,
        countOfSendedRequests,
        nameOfSendingRequestMethod,
        createMessageByNumberOfRequest
      );
    } else {
      await sendRequestsAndReceiveAllResponses(
        sender,
        countOfSendedRequests,
        nameOfSendingRequestMethod,
        createMessageByNumberOfRequest
      );
      break;
    }
  }
};

const sendRequestsAndReceiveAllResponses = function(
  sender,
  countOfRequests,
  nameOfSendingRequestMethod,
  createMessageByNumberOfRequest
) {
  const sendingMessages = [];

  for (let i = 0; i < countOfRequests; i += 1) {
    sendingMessages.push(sender[nameOfSendingRequestMethod](createMessageByNumberOfRequest(sender, i)));
  }
  return Promise.all(sendingMessages);
};

const sendResponse = function(createResponse, nameOfSendingResponseMethod, message, startIndex, senderOfResponse) {
  const response = createResponse(message, startIndex);
  senderOfResponse[nameOfSendingResponseMethod](response);
};

module.exports = measureSpeedOfSendingRequests;
