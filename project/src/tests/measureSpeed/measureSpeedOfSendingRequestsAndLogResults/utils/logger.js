"use strict";

const logger = {
  labels: {
    direction: {
      fromServerToClient: "server -> client ",
      fromClientToServer: "client -> server "
    },
    contentType: {
      binary: "binary  ",
      text: "text    "
    }
  },
  writeHeader(stream, countOfRequests) {
    stream.write(countOfRequests.toString());
    stream.write(" requests\n");
    stream.write("content direction        time (ms)\n");
  },
  writeRowWithResult(stream, labelOfContentType, labelOfDirection, timeMs) {
    stream.write(labelOfContentType);
    stream.write(labelOfDirection);
    stream.write(timeMs.toString());
    stream.write("\n");
  }
};

module.exports = logger;
