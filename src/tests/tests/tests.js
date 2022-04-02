"use strict";

const ResponsiveWebSocketServer = require("./../../Server/ResponsiveWebSocketServer"),
      ResponsiveWebSocketClient = require("./../../Client/ResponsiveWebSocketClient"),
      WebSocketClientFromW3C = require("./../../W3CWebSocketClient/W3CWebSocketClient"),
      createTester = require("./createTester");

ResponsiveWebSocketClient.setWebSocketClientClass(WebSocketClientFromW3C);

const responsiveServer = new ResponsiveWebSocketServer({url: "/room/*"}); 
const port = 4668;
const url = "ws://127.0.0.1:" + port + "/room/1234";

(async function prog() {
  const tester = createTester({
    nameOfTester: "test responsive web socket client and server",
    responsiveServer,
    port,
    urlOfServer: url,
    ResponsiveClient: ResponsiveWebSocketClient
  });
  await tester.run();
  process.exit(0);
})();
