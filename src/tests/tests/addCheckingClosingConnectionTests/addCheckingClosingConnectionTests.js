"use strict";

const checkClosingConnections = require("./checkClosingConnections");

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
        acceptor = cons[acceptingSide]
        
  //console.log(closer, acceptor);
  try {
    await checkClosingConnections(closer, acceptor);
  } catch(error) {
    closer.close();
    throw error;
  }
};

module.exports = addCheckingClosingConnectionTests;
