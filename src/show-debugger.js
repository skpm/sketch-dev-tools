/* eslint-disable no-undef, global-require, no-undef  */

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
    width: 800,
    height: 400,
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

  // Keeping the panel at the default window level
  webUI.panel.setLevel(NSNormalWindowLevel)
  // I found that keeping it at a window level allows me to
  // interact with Sketch freely without having the debugger
  // always in the way. I can switch to the debugger when needed
  // with the native 'Move focus to next window' shortcut.
  // IDEA: Add level/position/size options to debugger window?
  // IDEA: Add option to 'dock to bottom' à la chrome devtools?
  // IDEA: Keeping the window always on top is handy for debuggin the debugger

  // Setting some minSizes until we make it all responsive
  const minSize = { width: 700, height: 300 }
  webUI.panel.setContentMinSize(minSize)
}
