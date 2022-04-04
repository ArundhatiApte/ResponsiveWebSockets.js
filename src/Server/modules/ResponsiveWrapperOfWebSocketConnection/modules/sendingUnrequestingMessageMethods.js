"use strict";

const {
  _connection
} = require("./../../../../common/ResponsiveConnection/ResponsiveConnection")._namesOfPrivateProperties;

const {
  binaryMessager: {
    headerOfUnrequestingMessage: headerOfUnrequestingBinaryMessage
  },
  textMessager: {
    headerOfUnrequestingMessage: headerOfUnrequestingTextMessage
  }
} = require("./messaging/messaging");

const sendUnrequestingMessage = function(
  responsiveConnection,
  isMessageBinary,
  headerOfUnrequestingMessage,
  message
) {
  const connection = responsiveConnection[_connection];
  connection.sendFirstFragment(headerOfUnrequestingMessage, isMessageBinary);
  connection.sendLastFragment(message, isMessageBinary);
};

const sendUnrequestingBinaryMessage = function(message) {
  return sendUnrequestingMessage(this, true, headerOfUnrequestingBinaryMessage, message);
};

const sendUnrequestingTextMessage = function(message) {
  return sendUnrequestingMessage(this, false, headerOfUnrequestingTextMessage, message);
};

module.exports = {
  sendUnrequestingBinaryMessage,
  sendUnrequestingTextMessage
};
