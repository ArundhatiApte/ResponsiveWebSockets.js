"use strict";

import Server from "./src/ResponsiveWebSocketServer/ResponsiveWebSocketServer.js";
import WebSocketClient from "./src/W3CWebSocketClient/W3CWebSocketClient.js";

const exports = {
  Server,
  WebSocketClient
};

export default exports;
export {Server, WebSocketClient};
