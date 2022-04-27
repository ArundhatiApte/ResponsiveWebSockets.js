"use strict";

const { _connection } = require(
  "./../../common/ResponsiveWebSocketConnection/ResponsiveWebSocketConnection"
)._namesOfPrivateProperties;

const sendRequestByResponsiveConnection = require(
  "./../../common/ResponsiveWebSocketConnection/utils/sendRequestByResponsiveConnection"
);
const creatTextRequest = require("./../modules/messaging/messaging").textMessager.createRequestMessage;

const sendTextRequest = function(message, maxTimeMsToWaitResponse) {
  return sendRequestByResponsiveConnection(this, message, maxTimeMsToWaitResponse, sendMessageOfRequest);
};

const sendMessageOfRequest = function(responsiveConnection, idOfRequest, message) {
  return responsiveConnection[_connection].send(creatTextRequest(idOfRequest, message));
};

module.exports = sendTextRequest;
