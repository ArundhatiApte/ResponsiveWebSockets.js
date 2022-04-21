"use strict";

const ResponsiveWebSocketServer = require("./../../Server/ResponsiveWebSocketServer");
const ResponsiveWebSocketClient = require("./../../Client/ResponsiveWebSocketClient");
const WebSocketClientFromW3C = require("./../../W3CWebSocketClient/W3CWebSocketClient");

const executeTests = require("./executeTests");

ResponsiveWebSocketClient.setWebSocketClientClass(WebSocketClientFromW3C);

const responsiveWebSocketServer = new ResponsiveWebSocketServer({url: "/room/*"});
const port = 4668;
const url = "ws://127.0.0.1:" + port + "/room/1234";

executeTests(describe, it, {
  nameOfTest: "responsive web socket client and server",
  responsiveWebSocketServer,
  port,
  urlOfServer: url,
  ResponsiveWebSocketClient: ResponsiveWebSocketClient
});
