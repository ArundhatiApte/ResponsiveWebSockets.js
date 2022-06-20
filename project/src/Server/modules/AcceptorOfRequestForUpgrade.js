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
      userData ? {url: request.getUrl(), [_userData]: userData} : {url: request.getUrl()},
      request.getHeader("sec-websocket-key"),
      request.getHeader("sec-websocket-protocol"),
      request.getHeader("sec-websocket-extensions"),
      this[_usSocketContext]
    );
  }

  rejectConnection() {
    return this[_response].close();
  }
};

const _request = Symbol(),
      _response = Symbol(),
      _usSocketContext = Symbol(),
      _userData = "_u";

AcceptorOfRequestForUpgrade._userData = _userData;

module.exports = AcceptorOfRequestForUpgrade;
