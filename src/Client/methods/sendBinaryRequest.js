"use strict";

const {_connection} = require("./../../common/ResponsiveConnection/ResponsiveConnection")._namesOfPrivateProperties;
const sendRequestByResponsiveConnection = require(
  "./../../common/ResponsiveConnection/utils/sendRequestByResponsiveConnection"
);
const creatBinaryRequest = require("./../modules/messaging/messaging").binaryMessager.createRequestMessage;

const sendBinaryRequest = function(message, maxTimeMsToWaitResponse) {
  return sendRequestByResponsiveConnection(this, message, maxTimeMsToWaitResponse, sendMessageOfRequest);
};

const sendMessageOfRequest = function(responsiveConnection, idOfRequest, message) {
  return responsiveConnection[_connection].send(creatBinaryRequest(idOfRequest, message));
};

module.exports = sendBinaryRequest;
