"use strict";

const checkClosingConnection = require("./../checks/checkClosingConnection");

const addCheckingClosingConnectionTests = function(tester, createConnectionToClientAndClient) {
  tester.addTest(
    createFnToCheckClosingConnectionAndCloseIfFail(createConnectionToClientAndClient, "client", "connectionToClient"),
    {name: "close connection by client"}
  );
  tester.addTest(
    createFnToCheckClosingConnectionAndCloseIfFail(createConnectionToClientAndClient, "connectionToClient" , "client"),
    {name: "close connection by server"}
  );
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
