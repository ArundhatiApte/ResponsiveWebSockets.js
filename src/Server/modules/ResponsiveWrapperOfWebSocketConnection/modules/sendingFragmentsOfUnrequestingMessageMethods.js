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

const sendHeaderAndFragments = require("./sendHeaderAndFragments");

const sendFragmentsOfUnrequestingMessage = function(
  responsiveConnection,
  isMessageBinary,
  header,
  fragments
) {
  return sendHeaderAndFragments(
    responsiveConnection[_connection],
    isMessageBinary,
    header,
    fragments
  );
};

const sendFragmentsOfUnrequestingBinaryMessage = function() {
  return sendFragmentsOfUnrequestingMessage(this, true, headerOfUnrequestingBinaryMessage, arguments);
};

const sendFragmentsOfUnrequestingTextMessage = function() {
  return sendFragmentsOfUnrequestingMessage(this, false, headerOfUnrequestingTextMessage, arguments);
};

module.exports = {
  sendFragmentsOfUnrequestingBinaryMessage,
  sendFragmentsOfUnrequestingTextMessage
};
