"use strict";

const expectEqual = require("assert").strictEqual;

const typesOfIncomingMessages = require("./../typesOfIncomingMessages");

const {
  extractIdOfMessage,
  extractTypeOfMessage,

  fillHeaderAsRequest,
  fillHeaderAsResponse,
  fillHeaderAsUnrequestingMessage,

  sizeOfHeaderForRequest
} = require("./binaryMessager");

const testExtractingTypeOfIncimingMessage = function() {
  const message = new ArrayBuffer(sizeOfHeaderForRequest + 2);

  fillHeaderAsRequest(12, message);
  expectEqual(typesOfIncomingMessages.request, extractTypeOfMessage(message));

  fillHeaderAsResponse(123, message);
  expectEqual(typesOfIncomingMessages.response, extractTypeOfMessage(message));

  fillHeaderAsUnrequestingMessage(message);
  expectEqual(typesOfIncomingMessages.unrequestingMessage, extractTypeOfMessage(message));
};

const createFnToCheckExtractingIdOfMessage = (function() {
  const createFnToCheckExtractingIdOfMessage = function(fillHeaderAsRequestOrResponse) {
    return _checkExtractingIdOfMessage.bind(null, fillHeaderAsRequestOrResponse);
  };

  const _checkExtractingIdOfMessage = function(fillHeaderAsRequestOrResponse) {
    let extractedId;
    for (let idOfMessage = maxValueOfUint16Plus1; idOfMessage; ) {
      idOfMessage -= 1;
      fillHeaderAsRequestOrResponse(idOfMessage, message);
      extractedId = extractIdOfMessage(message);
      expectEqual(idOfMessage, extractedId);
    }
  };
  const maxValueOfUint16Plus1 = Math.pow(2, 16);
  const message = new ArrayBuffer(sizeOfHeaderForRequest + 12);

  return createFnToCheckExtractingIdOfMessage;
})();

describe("binary messager", function() {
  it("extracting type of message", testExtractingTypeOfIncimingMessage);
  it("extracting id of request", createFnToCheckExtractingIdOfMessage(fillHeaderAsRequest));
  it("extracting id of response", createFnToCheckExtractingIdOfMessage(fillHeaderAsResponse));
});
