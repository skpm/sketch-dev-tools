import WebUI from 'sketch-module-web-view'
import getSketchState from './get-sketch-state'
import { SET_TREE } from '../shared-actions'
import { identifier } from '../debugger'

export default function(context) {
  // enabled listening to all the actions
  AppController.sharedInstance()
    .pluginManager()
    .setWilcardsEnabled(true)

  const webUI = new WebUI(context, require('../resources/webview.html'), {
    identifier,
    x: 0,
    y: 0,
    width: 1000,
    height: 700,
    blurredBackground: true,
    onlyShowCloseButton: true,
    hideTitleBar: true,
    shouldKeepAround: true,
    handlers: {
      getSketchState() {
        const state = getSketchState()

        webUI.eval(
          `sketchBridge(${JSON.stringify({ name: SET_TREE, payload: state })})`
        )
      },
    },
  })
}
