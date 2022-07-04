module.exports = {
  entry: "./checkSendingMessagesInBrowser.js",
  output: {
    path: __dirname,
    filename: "webpackedScriptForBrowser.js"
  },
  optimization: {
    minimize: false,
    moduleIds: "named"
  }
};
