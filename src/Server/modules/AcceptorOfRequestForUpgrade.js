"use strict";

const AcceptorOfRequestForUpgrade = class {
  constructor(
    httpRequest,
    httpResponse,
    usSocketContext
  ) {
    this[_request] = httpRequest;
    this[_response] = httpResponse;
    this[_usSocketContext] = usSocketContext;
  }

  acceptConnection(userData) {
    const request = this[_request];
    this[_response].upgrade(
      userData ? {url: request.getUrl(), userData} : {url: request.getUrl()},
      request.getHeader("sec-websocket-key"),
      request.getHeader("sec-websocket-protocol"),
      request.getHeader("sec-websocket-extensions"),
      this[_usSocketContext]
    );
  }

  cancelConnection() {
    return this[_response].close();
  }
};

const _request = Symbol(),
      _response = Symbol(),
      _usSocketContext = Symbol();

module.exports = AcceptorOfRequestForUpgrade;
