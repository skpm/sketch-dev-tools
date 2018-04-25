/* globals AppController */
/* eslint-disable global-require, no-undef */
import BrowserWindow from 'sketch-module-web-view'
import { prepareValue } from 'sketch-utils'
import getSketchState, {
  getPageMetadata,
  getLayerMetadata,
} from './get-sketch-state'
import {
  SET_TREE,
  SET_PAGE_METADATA,
  SET_LAYER_METADATA,
  SET_SCRIPT_RESULT,
} from '../shared-actions'
import { identifier } from '../debugger'
import { runScript, clearScriptsCache, runCommand } from './run-script'

export default function() {
  let stopListening

  // enabled listening to all the actions
  AppController.sharedInstance()
    .pluginManager()
    .setWilcardsEnabled(true)

  const browserWindow = new BrowserWindow({
    identifier,
    width: 830,
    height: 400,
    minWidth: 700,
    minHeight: 300,
    minimizable: false,
    maximizable: false,
    alwaysOnTop: process.env.NODE_ENV !== 'production',
    fullscreenable: false,
    acceptFirstMouse: true,
    title: 'Sketch DevTools',
    resizable: true,
  })

  browserWindow.loadURL(require('../resources/webview.html'))

  browserWindow.once('ready-to-show', () => {
    browserWindow.show()
  })

  browserWindow.on('closed', () => {
    AppController.sharedInstance()
      .pluginManager()
      .setWilcardsEnabled(false)

    if (stopListening) {
      stopListening()
    }
  })

  browserWindow.webContents.on('getSketchState', () => {
    const state = getSketchState()

    browserWindow.webContents.executeJavaScript(
      `sketchBridge(${JSON.stringify({ name: SET_TREE, payload: state })})`
    )
  })

  browserWindow.webContents.on('getPageMetadata', pageId => {
    const state = getPageMetadata(pageId)

    browserWindow.webContents.executeJavaScript(
      `sketchBridge(${JSON.stringify({
        name: SET_PAGE_METADATA,
        payload: { pageId, state },
      })})`
    )
  })

  browserWindow.webContents.on('getLayerMetadata', (layerId, pageId) => {
    const state = getLayerMetadata(layerId, pageId)

    browserWindow.webContents.executeJavaScript(
      `sketchBridge(${JSON.stringify({
        name: SET_LAYER_METADATA,
        payload: { layerId, pageId, state },
      })})`
    )
  })

  browserWindow.webContents.on('onRunScript', (script, runId) => {
    const result = runScript(script)
    browserWindow.webContents.executeJavaScript(
      `sketchBridge(${JSON.stringify({
        name: SET_SCRIPT_RESULT,
        payload: {
          result: prepareValue(result),
          id: runId,
        },
      })})`
    )
  })

  browserWindow.webContents.on('onRunCommand', (command, runId) => {
    runCommand(command)
      .catch(err => err)
      .then(result => {
        browserWindow.webContents.executeJavaScript(
          `sketchBridge(${JSON.stringify({
            name: SET_SCRIPT_RESULT,
            payload: {
              result: prepareValue(result || 'done'),
              id: runId,
            },
          })})`
        )
      })
  })

  browserWindow.webContents.on('clearScriptsCache', () => {
    clearScriptsCache()
  })
}
