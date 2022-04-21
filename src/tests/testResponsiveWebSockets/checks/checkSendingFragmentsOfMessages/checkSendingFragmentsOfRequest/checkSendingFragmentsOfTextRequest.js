"use strict";

const areStringsEqual = require("./../utils/areStringsEqual");
const createFnToCheckSendingFragmentsOfRequest = require("./_createFnToCheckSendingFragmentsOfRequest");

const fragmentsOfRequest = ["one , ", " Two. ", " 3333 ", "IV"];
const fullRequest = fragmentsOfRequest.join("");
const response = "lorem ipsum";

module.exports = createFnToCheckSendingFragmentsOfRequest(
  fragmentsOfRequest,
  "sendFragmentsOfTextRequest",
  fullRequest,
  areStringsEqual,
  "setTextRequestListener",
  response,
  "sendTextResponse"
);
