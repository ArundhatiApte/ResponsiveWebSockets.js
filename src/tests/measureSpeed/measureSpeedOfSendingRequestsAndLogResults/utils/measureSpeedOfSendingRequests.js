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
  let countOfSendedRequests = 0;

  while (countOfRequests > 0) {
    if (countOfRequests > maxCountOfRequestsAtOnce) {
      countOfSendedRequests = maxCountOfRequestsAtOnce;
      countOfRequests -= maxCountOfRequestsAtOnce;
      await sendRequestsAndReceiveResponses(
        sender,
        receiver,
        countOfSendedRequests,
        nameOfSendingRequestMethod,
        nameOfSettingListenerOfRequestMethod,
        createMessageByNumberOfRequest,
        createResponse,
        nameOfSendingResponseMethod
      );
    } else {
      await sendRequestsAndReceiveResponses(
        sender,
        receiver,
        countOfRequests,
        nameOfSendingRequestMethod,
        nameOfSettingListenerOfRequestMethod,
        createMessageByNumberOfRequest,
        createResponse,
        nameOfSendingResponseMethod
      );
      break;
    }
  }
  const timeOfEnd = Date.now();
  return timeOfEnd - timeOfStart;
};

const maxCountOfRequestsAtOnce = Math.pow(2, 16) - 1;

const sendRequestsAndReceiveResponses = function(
  sender,
  receiver,
  countOfRequests,
  nameOfSendingRequestMethod,
  nameOfSettingListenerOfRequestMethod,
  createMessageByNumberOfRequest,
  createResponse,
  nameOfSendingResponseMethod
) {
  const sendingMessages = [];

  const listener = sendResponse.bind(null, createResponse, nameOfSendingResponseMethod);
  receiver[nameOfSettingListenerOfRequestMethod](listener);

  for (let i = 0; i < countOfRequests; i += 1) {
    sendingMessages.push(sender[nameOfSendingRequestMethod](createMessageByNumberOfRequest(sender, countOfRequests)));
  }
  return Promise.all(sendingMessages);
};

const sendResponse = function(createResponse, nameOfSendingResponseMethod, message, startIndex, senderOfResponse) {
  const response = createResponse(message, startIndex);
  senderOfResponse[nameOfSendingResponseMethod](response);
};

module.exports = measureSpeedOfSendingRequests;
