"use strict";

const checkClosingConnection = require("./../checks/checkClosingConnection");

const addCheckingClosingConnectionTests = function(describeTests, addTest, createConnectionToClientAndClient) {
  return describeTests("closing connection", function() {
    addTest(
      "close connection by client",
      createFnToCheckClosingConnectionAndCloseIfFail(createConnectionToClientAndClient, "client", "connectionToClient")
    );
    addTest(
      "close connection by server",
      createFnToCheckClosingConnectionAndCloseIfFail(createConnectionToClientAndClient, "connectionToClient" , "client")
    );
  });
};

const createFnToCheckClosingConnectionAndCloseIfFail = function(
  createConnectionToClientAndClient,
  closingSide,
  acceptingSide
) {
  return executeTestAndCloseConnectionsIfFail.bind(null, createConnectionToClientAndClient, closingSide, acceptingSide);
};

const executeTestAndCloseConnectionsIfFail = async function(
  createConnectionToClientAndClient,
  closingSide,
  acceptingSide
) {
  const cons = await createConnectionToClientAndClient();
  const closer = cons[closingSide],
        acceptor = cons[acceptingSide];
  try {
    await checkClosingConnection(closer, acceptor);
  } catch(error) {
    closer.close();
    throw error;
  }
};

module.exports = addCheckingClosingConnectionTests;
