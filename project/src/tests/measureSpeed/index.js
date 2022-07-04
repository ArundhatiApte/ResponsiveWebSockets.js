"use strict";

const uWebSockets = require("uWebSockets.js");

const ResponsiveWebSocketServer = require("./../../Server/ResponsiveWebSocketServer");
const ResponsiveWebSocketClient = require("./../../Client/ResponsiveWebSocketClient");
const W3CWebSocketClient = require("./../../W3CWebSocketClient");

const createConnectionToClientAndClient = require("./../modules/createConnectionToClientAndClient");
const measureSpeedOfSendingRequestsAndLogResults = require(
  "./measureSpeedOfSendingRequestsAndLogResults/measureSpeedOfSendingRequestsAndLogResults"
);

ResponsiveWebSocketServer.setUWebSockets(uWebSockets);
ResponsiveWebSocketClient.setWebSocketClientClass(W3CWebSocketClient);

(async function() {
  const server = new ResponsiveWebSocketServer({server: new uWebSockets.App({})});
  await server.listen(8888);

  const {connectionToClient, client} = await createConnectionToClientAndClient(
    server,
    "ws://127.0.0.1:8888",
    ResponsiveWebSocketClient
  );

  const maxTimeMs = 4500;
  connectionToClient.setMaxTimeMsToWaitResponse(maxTimeMs);
  client.setMaxTimeMsToWaitResponse(maxTimeMs);

  const countOfRequests = 100_000;
  await measureSpeedOfSendingRequestsAndLogResults(connectionToClient, client, countOfRequests, process.stdout);

  connectionToClient.terminate();
  client.terminate();
  await server.close();
})();
