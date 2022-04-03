"use strict";

const checkAcceptingRequestOnUpgrade = require("./checks/checkAcceptingRequestOnUpgrade");
const checkCancelRequestOnUpgrade = require("./checks/checkCancelRequestOnUpgrade");

const addCheckingUpgradingConnetionTests = function(
  tester,
  webSocketServer,
  urlOfServer,
  WebSocketClient
) {
  tester.addTest(
    checkAcceptingRequestOnUpgrade.bind(null, webSocketServer, urlOfServer, WebSocketClient),
    {name: "accept request on upgrade"}
  );
  tester.addTest(
    checkCancelRequestOnUpgrade.bind(null, webSocketServer, urlOfServer, WebSocketClient),
    {name: "cancel request on upgrade"}
  );
};

module.exports = addCheckingUpgradingConnetionTests;
