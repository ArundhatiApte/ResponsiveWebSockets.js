module.exports = {
  entry: "./testSendingMessagesInBrowser.mjs",
  output: {
    path: __dirname,
    filename: "webpackedScriptForBrowser.js"
  },
  optimization: {
    minimize: false,
    moduleIds: "named"
  }
};
