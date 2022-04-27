"use strict";

const ResponsiveWebSocketServer = require("./../../Server/ResponsiveWebSocketServer");
const ResponsiveWebSocketClient = require("./../../Client/ResponsiveWebSocketClient");
const W3CWebSocketClient = require("./../../W3CWebSocketClient/W3CWebSocketClient");

const createConnectionToClientAndClient = require("./../modules/createConnectionToClientAndClient");
const measureSpeedOfSendingRequestsAndLogResults = require(
  "./measureSpeedOfSendingRequestsAndLogResults/measureSpeedOfSendingRequestsAndLogResults"
);

ResponsiveWebSocketClient.setWebSocketClientClass(W3CWebSocketClient);
(async function() {
  const server = new ResponsiveWebSocketServer();
  await server.listen(8888);

  const {connectionToClient, client} = await createConnectionToClientAndClient(
    server,
    "ws://127.0.0.1:8888",
    ResponsiveWebSocketClient
  );

  const maxTimeMs = 4500;
  connectionToClient.setMaxTimeMsToWaitResponse(maxTimeMs);
  client.setMaxTimeMsToWaitResponse(maxTimeMs);

  const countOfRequests = 1_000_000;
  await measureSpeedOfSendingRequestsAndLogResults(connectionToClient, client, countOfRequests, process.stdout);

  client.close();
  await server.close();
})();
