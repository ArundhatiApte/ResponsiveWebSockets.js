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
  
  close(code, reason) {
    return this[_connection].close(code, reason);
  }

  terminate() {
    return this[_connection].terminate();
  }
  
  getRemoteAddress() {
    return this[_connection].getRemoteAddress();
  }

  setCloseListener(listener) {
    this[_connection].onClose = (event) => {
      return listener.call(this, event);
    };
  }
};

ResponsiveConnectionToWebSocketClient.contentTypesOfMessages = ResponsiveWebSoket.contentTypesOfMessages;

module.exports = ResponsiveConnectionToWebSocketClient;
