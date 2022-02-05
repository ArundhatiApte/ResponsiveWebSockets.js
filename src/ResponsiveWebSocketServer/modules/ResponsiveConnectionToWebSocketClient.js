"use strict";

const ResponsiveWebSoket = require("./../../common/ResponsiveWebSocketConnection/ResponsiveWebSocketConnection"),
      {_connection} = ResponsiveWebSoket._namesOfPrivateProperties;
 
const ResponsiveConnectionToWebSocketClient = class extends ResponsiveWebSoket {
  constructor(nonResponsiveConnectionToClient) {
    super(nonResponsiveConnectionToClient);
  }

  get url() {
    return this[_connection].url;
  }
  
  close(code, reason) {
    return this[_connection].close(code, reason);
  }

  terminate() {
    return this[_connection].terminate();
  }
  
  getRemoteAddress() {
    return this[_connection].getRemoteAddress();
  }
};

ResponsiveConnectionToWebSocketClient.contentTypesOfMessages = ResponsiveWebSoket.contentTypesOfMessages;

module.exports = ResponsiveConnectionToWebSocketClient;
