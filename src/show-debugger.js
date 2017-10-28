import WebUI from 'sketch-module-web-view'
import getSketchState, {
  getPageMetadata,
  getLayerMetadata,
} from './get-sketch-state'
import {
  SET_TREE,
  SET_PAGE_METADATA,
  SET_LAYER_METADATA,
} from '../shared-actions'
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
    hideTitleBar: false,
    shouldKeepAround: true,
    resizable: true,
    onPanelClose() {
      AppController.sharedInstance()
        .pluginManager()
        .setWilcardsEnabled(false)
    },
    handlers: {
      getSketchState() {
        const state = getSketchState()

        webUI.eval(
          `sketchBridge(${JSON.stringify({ name: SET_TREE, payload: state })})`
        )
      },

      getPageMetadata(pageId) {
        const state = getPageMetadata(pageId)

        webUI.eval(
          `sketchBridge(${JSON.stringify({
            name: SET_PAGE_METADATA,
            payload: { pageId, state },
          })})`
        )
      },

      getLayerMetadata(layerId, pageId) {
        const state = getLayerMetadata(layerId, pageId)

        webUI.eval(
          `sketchBridge(${JSON.stringify({
            name: SET_LAYER_METADATA,
            payload: { layerId, pageId, state },
          })})`
        )
      },
    },
  })
}
