"use strict";

const {_connection} = require("./../../common/ResponsiveConnection/ResponsiveConnection")._namesOfPrivateProperties;
const sendRequestByResponsiveConnection = require(
  "./../../common/ResponsiveConnection/utils/sendRequestByResponsiveConnection"
);
const creatTextRequest = require("./../modules/messaging/messaging").textMessager.createRequestMessage;

const sendTextRequest = function(message, maxTimeMsToWaitResponse) {
  return sendRequestByResponsiveConnection(this, message, maxTimeMsToWaitResponse, sendMessageOfRequest);
};

const sendMessageOfRequest = function(responsiveConnection, idOfRequest, message) {
  return responsiveConnection[_connection].send(creatTextRequest(idOfRequest, message));
};

module.exports = sendTextRequest;
