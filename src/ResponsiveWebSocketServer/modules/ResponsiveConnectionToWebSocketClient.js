"use strict";

const ResponsiveWebSoket = require("./../../common/ResponsiveWebSocketConnection/ResponsiveWebSocketConnection"),
      {_connection} = ResponsiveWebSoket._namesOfPrivateProperties;
 
const ResponsiveConnectionToWebSocketClient = class extends ResponsiveWebSoket {
  constructor(nonResponsiveConnectionToClient) {
    super(nonResponsiveConnectionToClient);
  }

  terminate() {
    return this[_connection].terminate();
  }
  
  getRemoteAddress() {
    return this[_connection].getRemoteAddress();
  }
};

module.exports = ResponsiveConnectionToWebSocketClient;
