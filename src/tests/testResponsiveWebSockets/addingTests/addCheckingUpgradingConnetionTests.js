"use strict";

const checkAcceptingRequestOnUpgrade = require("./../checks/checkUpgradingConnection/checkAcceptingRequestOnUpgrade");
const checkCancelRequestOnUpgrade = require("./../checks/checkUpgradingConnection/checkCancelRequestOnUpgrade");

const addCheckingUpgradingConnetionTests = function(
  addTest,
  webSocketServer,
  urlOfServer,
  WebSocketClient
) {
  addTest(
    "accept request on upgrade",
    checkAcceptingRequestOnUpgrade.bind(null, webSocketServer, urlOfServer, WebSocketClient)
  );
  addTest(
    "cancel request on upgrade",
    checkCancelRequestOnUpgrade.bind(null, webSocketServer, urlOfServer, WebSocketClient)
  );
};

module.exports = addCheckingUpgradingConnetionTests;
