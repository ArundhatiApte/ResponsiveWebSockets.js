"use strict";

const checkAcceptingRequestOnUpgrade = require("./../checks/checkUpgradingConnection/checkAcceptingRequestOnUpgrade");
const checkCancelRequestOnUpgrade = require("./../checks/checkUpgradingConnection/checkCancelRequestOnUpgrade");

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
      "cancel request on upgrade",
      checkCancelRequestOnUpgrade.bind(null, webSocketServer, urlOfServer, WebSocketClient)
    );
  });
};

module.exports = addCheckingUpgradingConnetionTests;
