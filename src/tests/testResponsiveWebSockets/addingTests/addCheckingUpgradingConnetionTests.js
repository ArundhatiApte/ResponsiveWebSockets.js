"use strict";

const checkAcceptingRequestOnUpgrade = require("./../checks/checkUpgradingConnection/checkAcceptingRequestOnUpgrade");
const checkRejectingRequestOnUpgrade = require("./../checks/checkUpgradingConnection/checkRejectingRequestOnUpgrade");

const addCheckingUpgradingConnetionTests = function(
  describeTests,
  addTest,
  webSocketServer,
  urlOfServer,
  WebSocketClient
) {
  return describeTests("upgrading to web socket", function() {
    addTest(
      "accept request on upgrade",
      checkAcceptingRequestOnUpgrade.bind(null, webSocketServer, urlOfServer, WebSocketClient)
    );
    addTest(
      "reject request on upgrade",
      checkRejectingRequestOnUpgrade.bind(null, webSocketServer, urlOfServer, WebSocketClient)
    );
  });
};

module.exports = addCheckingUpgradingConnetionTests;
