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
    {name: "test accepting request on upgrade"}
  );
  tester.addTest(
    checkCancelRequestOnUpgrade.bind(null, webSocketServer, urlOfServer, WebSocketClient),
    {name: "test cancel request on upgrade"}
  );
};

module.exports = addCheckingUpgradingConnetionTests;
