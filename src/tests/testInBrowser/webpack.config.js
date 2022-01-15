module.exports = {
  entry: "./testSendingMessagesInBrowser.js",
  output: {
    path: __dirname,
    filename: "webpackedScriptForBrowser.js"
  },
  optimization: {
    minimize: false,
    moduleIds: "named"
  }
};
