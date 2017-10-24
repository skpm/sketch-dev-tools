import WebUI from 'sketch-module-web-view'

export default function(context) {
  const webUI = new WebUI(context, require('../resources/webview.html'), {
    identifier: 'unique.id', // to reuse the UI
    x: 0,
    y: 0,
    width: 240,
    height: 180,
    blurredBackground: true,
    onlyShowCloseButton: true,
    hideTitleBar: false,
    shouldKeepAround: true,
    frameLoadDelegate: { // https://developer.apple.com/reference/webkit/webframeloaddelegate?language=objc
      'webView:didFinishLoadForFrame:'(webView, webFrame) {
        context.document.showMessage('UI loaded!')
      }
    },
    handlers: {
      nativeLog(s) {
        context.document.showMessage(s)

        webUI.eval(`setRandomNumber(${Math.random()})`)
      }
    }
  })
}
