/* eslint-disable no-var, prefer-template, prefer-arrow-callback, prefer-destructuring, object-shorthand */
var remoteWebview = require('sketch-module-web-view/remote')

module.exports.identifier = 'skpm.debugger'

module.exports.isDebuggerPresent = remoteWebview.isWebviewPresent.bind(
  this,
  module.exports.identifier
)

module.exports.sendToDebugger = function sendToDebugger(name, payload) {
  return remoteWebview
    .sendToWebview(
      module.exports.identifier,
      'sketchBridge(' +
        JSON.stringify({
          name: name,
          payload: payload,
        }) +
        ');'
    )
    .catch(function swallowError() {}) // swallow the error otherwise we end up in an infinite loop
}
