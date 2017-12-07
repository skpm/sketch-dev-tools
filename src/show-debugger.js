/* globals AppController */
/* eslint-disable global-require, no-undef */
import WebUI from 'sketch-module-web-view'
import getSketchState, {
  getPageMetadata,
  getLayerMetadata,
} from './get-sketch-state'
import {
  SET_TREE,
  SET_PAGE_METADATA,
  SET_LAYER_METADATA,
  ADD_LOG,
  SET_SCRIPT_RESULT,
} from '../shared-actions'
import { identifier, sendToDebugger, prepareValue } from '../debugger'
import startListeningToLogs from './listen-to-logs'
import { runScript, clearScriptsCache, runCommand } from './run-script'

const logRegex = new RegExp(`^${console._skpmPrefix}`)

export default function(context) {
  let stopListening

  // enabled listening to all the actions
  AppController.sharedInstance()
    .pluginManager()
    .setWilcardsEnabled(true)

  const webUI = new WebUI(context, require('../resources/webview.html'), {
    identifier,
    x: 0,
    y: 0,
    width: 830,
    height: 400,
    blurredBackground: true,
    onlyShowCloseButton: true,
    hideTitleBar: false,
    shouldKeepAround: true,
    title: 'Sketch DevTools',
    resizable: true,
    onPanelClose() {
      AppController.sharedInstance()
        .pluginManager()
        .setWilcardsEnabled(false)

      if (stopListening) {
        stopListening()
      }
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

      onRunScript(script, runId) {
        const result = runScript(script)
        webUI.eval(
          `sketchBridge(${JSON.stringify({
            name: SET_SCRIPT_RESULT,
            payload: {
              result: prepareValue(result),
              id: runId,
            },
          })})`
        )
      },

      onRunCommand(command, runId) {
        const { err, result } = runCommand(command)
        webUI.eval(
          `sketchBridge(${JSON.stringify({
            name: SET_SCRIPT_RESULT,
            payload: {
              result: prepareValue(err || result || 'done'),
              id: runId,
            },
          })})`
        )
      },

      clearScriptsCache() {
        clearScriptsCache()
      },
    },
  })
  // Setting some minSizes until we make it all responsive
  const minSize = { width: 700, height: 300 }
  webUI.panel.setContentMinSize(minSize)
  // Keep the window on top only for development
  if (process.env.NODE_ENV === 'production') {
    webUI.panel.setLevel(NSNormalWindowLevel)
  }

  // start listening to all the logs
  stopListening = startListeningToLogs(text => {
    let logs = text.split(' «Plugin Output»\n')
    logs.pop()

    // filter out the one we handle with `console`
    logs = logs.filter(l => !logRegex.test(l))

    if (!logs.length) {
      return
    }

    const payload = {
      ts: Date.now(),
      type: 'log',
      values: logs.map(prepareValue),
    }

    sendToDebugger(ADD_LOG, payload)
  })
}
