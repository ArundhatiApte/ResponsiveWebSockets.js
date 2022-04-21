"use strict";

const expectEqual = require("assert").strictEqual;
const Tester = require("tester");

const typesOfIncomingMessages = require("./../../../../../../common/messaging/typesOfIncomingMessages");

const testMessager = function(describeTests, addTest, options) {
  const { messager } = options;
  const { extractTypeOfIncomingMessage, extractIdOfMessage } = messager;

  describeTests(options.nameOfTest, function() {
    addTest("creating and parsing request", createTest(checkCreatingAndParsingRequest,
      messager.createHeaderOfRequest,
      extractTypeOfIncomingMessage,
      extractIdOfMessage
    ));
    addTest("creating and parsing unrequesting message", createTest(checkCreatingAndParsingUnrequestingMessage,
      messager.headerOfUnrequestingMessage,
      extractTypeOfIncomingMessage
    ));
    addTest("creating and parsing response", createTest(checkCreatingAndParsingResponse,
      messager.createHeaderOfResponse,
      extractTypeOfIncomingMessage,
      extractIdOfMessage
    ));
  });
};

const createTest = function(check, ...args) {
  return check.bind(null, ...args);
};

const checkCreatingAndParsingRequest = function(
  createHeaderOfRequest,
  extractTypeOfIncomingMessage,
  extractIdOfMessage
) {
  const idOfRequest = 11;
  const header = createHeaderOfRequest(idOfRequest);
  const type = extractTypeOfIncomingMessage(header);
  expectEqual(type, typesOfIncomingMessages.request);
  const id = extractIdOfMessage(header);
  expectEqual(id, idOfRequest);
};

const checkCreatingAndParsingUnrequestingMessage = function(
  headerOfUnrequestingMessage,
  extractTypeOfIncomingMessage
) {
  const type = extractTypeOfIncomingMessage(headerOfUnrequestingMessage);
  expectEqual(type, typesOfIncomingMessages.unrequestingMessage);
};

const checkCreatingAndParsingResponse = function(
  createHeaderOfResponse,
  extractTypeOfIncomingMessage,
  extractIdOfMessage
) {
  const idOfMessage = 111;
  const header = createHeaderOfResponse(idOfMessage);
  const type = extractTypeOfIncomingMessage(header);
  expectEqual(type, typesOfIncomingMessages.response);
  const id = extractIdOfMessage(header);
  expectEqual(id, idOfMessage);
};

module.exports = testMessager;
