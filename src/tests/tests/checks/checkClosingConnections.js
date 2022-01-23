"use strict";

const expectEqual = require("assert").strictEqual;

const code = 1009,
      reason = "message";

const checkClosingConnections = function(closingSide, acceptor) {
  return new Promise(function(resolve, reject) {
    acceptor.setCloseListener(function(event) {
      if (event.code === code && event.reason === reason) {
        resolve();
      } else {
        reject(new Error(`${JSON.stringify(event)} !== ${JSON.stringify({code, reason})}`));
      }
    });

    closingSide.close(code, reason);
  });
};

module.exports = checkClosingConnections;
