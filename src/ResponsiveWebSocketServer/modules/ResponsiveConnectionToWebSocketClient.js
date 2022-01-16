"use strict";

const ResponsiveWebSoket = require("./../../common/ResponsiveWebSocketConnection"),
      {_connection} = ResponsiveWebSoket._namesOfPrivateProperties;
 
const ResponsiveConnectionToWebSocketClient = class extends ResponsiveWebSoket {
  constructor(nonResponsiveConnectionToClient) {
    super(nonResponsiveConnectionToClient);
  }

  get url() {
    return this[_connection].url;
  }
  
  close() {
    return this[_connection].close();
  }

  getRemoteAddress() {
    return this[_connection].getRemoteAddress();
  }
};

ResponsiveConnectionToWebSocketClient.contentTypesOfMessages = ResponsiveWebSoket.contentTypesOfMessages;

module.exports = ResponsiveConnectionToWebSocketClient;
