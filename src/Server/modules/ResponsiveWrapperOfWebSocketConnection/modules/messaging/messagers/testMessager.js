"use strict";

const expectEqual = require("assert").strictEqual;
const Tester = require("tester");

const typesOfIncomingMessages = require("./../../../../../../common/messaging/typesOfIncomingMessages");

const testMessager = function(options) {
  return createTester(options).run();
};

const createTester = function(options) {
  const tester = new Tester(options.nameOfTester);
  addTests(tester, options);
  return tester;
};

const addTests = function(tester, options) {
  const { messager } = options;
  const { extractTypeOfIncomingMessage, extractIdOfMessage } = messager;

  tester.addTest(
    checkCreatingAndParsingRequest.bind(
      null,
      messager.createHeaderOfRequest,
      extractTypeOfIncomingMessage,
      extractIdOfMessage
    ),
    {name: "test creating and parsing request"}
  );
  tester.addTest(
    checkCreatingAndParsingUnrequestingMessage.bind(
      null,
      messager.headerOfUnrequestingMessage,
      extractTypeOfIncomingMessage
    ),
    {name: "test creating and parsing unrequesting message"}
  );
  tester.addTest(
    checkCreatingAndParsingResponse.bind(
      null,
      messager.createHeaderOfResponse,
      extractTypeOfIncomingMessage,
      extractIdOfMessage
    ),
    {name: "test creating and parsing response"}
  );
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
