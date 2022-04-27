"use strict";

const {
  _namesOfPrivateProperties: { _connection }
} = require("./../../../../common/ResponsiveWebSocketConnection/ResponsiveWebSocketConnection");

const {
  binaryMessager: {
    headerOfUnrequestingMessage: headerOfUnrequestingBinaryMessage
  },
  textMessager: {
    headerOfUnrequestingMessage: headerOfUnrequestingTextMessage
  }
} = require("./messaging/messaging");

const sendHeaderAndFragments = require("./utilsForWebSocket/sendHeaderAndFragments");

const sendFragmentsOfUnrequestingMessage = function(
  responsiveConnection,
  header,
  isMessageBinary,
  fragments
) {
  return sendHeaderAndFragments(
    responsiveConnection[_connection],
    header,
    isMessageBinary,
    fragments
  );
};

const sendFragmentsOfUnrequestingBinaryMessage = function() {
  return sendFragmentsOfUnrequestingMessage(this, headerOfUnrequestingBinaryMessage, true, arguments);
};

const sendFragmentsOfUnrequestingTextMessage = function() {
  return sendFragmentsOfUnrequestingMessage(this, headerOfUnrequestingTextMessage, false, arguments);
};

module.exports = {
  sendFragmentsOfUnrequestingBinaryMessage,
  sendFragmentsOfUnrequestingTextMessage
};
