"use strict";

const typesOfIncomingMessages = require(
  "./../../../../../../../common/ResponsiveWebSocketConnection/modules/messaging/typesOfIncomingMessages"
);

const createFnToCheckCreatingAndParsingMessagesWithId = require(
  "./checks/createFnToCheckCreatingAndParsingMessagesWithId"
);
const checkCreatingAndParsingUnrequestingMessage = require("./checks/checkCreatingAndParsingUnrequestingMessage");

const checkCreatingAndParsingRequest = createFnToCheckCreatingAndParsingMessagesWithId(
  typesOfIncomingMessages.request
);
const checkCreatingAndParsingResponse = createFnToCheckCreatingAndParsingMessagesWithId(
  typesOfIncomingMessages.response
);

const testMessager = function(describeTests, addTest, options) {
  const {
    messager,
    client: {
      messager: clientMessager,
      message
    }
  } = options;
  const { extractTypeOfIncomingMessage, extractIdOfMessage } = messager;

  describeTests(options.nameOfTest, function() {
    addTest("request", createTest(checkCreatingAndParsingRequest,
      messager.createHeaderOfRequest,
      clientMessager.createRequestMessage,
      message,
      extractTypeOfIncomingMessage,
      extractIdOfMessage
    ));
    addTest("response", createTest(checkCreatingAndParsingResponse,
      messager.createHeaderOfResponse,
      clientMessager.createResponseMessage,
      message,
      extractTypeOfIncomingMessage,
      extractIdOfMessage
    ));
    addTest("unrequesting message", createTest(checkCreatingAndParsingUnrequestingMessage,
      messager.headerOfUnrequestingMessage,
      extractTypeOfIncomingMessage
    ));
  });
};

const createTest = function(check, ...args) {
  return check.bind(null, ...args);
};

module.exports = testMessager;
