"use strict";

import Server from "./src/ResponsiveWebSocketServer/ResponsiveWebSocketServer.js";
import W3CWebSocketClient from "./src/W3CWebSocketClient/W3CWebSocketClient.js";

const exports = {
  Server,
  W3CWebSocketClient
};

export default exports;
export {Server, W3CWebSocketClient};
