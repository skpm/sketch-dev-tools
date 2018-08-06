/* globals AppController, NSWorkspace */
/* eslint-disable global-require */
import Settings from 'sketch/settings' // eslint-disable-line
import BrowserWindow from 'sketch-module-web-view'
import { getWebview } from 'sketch-module-web-view/remote'
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
  SET_SETTINGS,
} from '../shared-actions'
import { identifier } from '../debugger'
import { runScript, clearScriptsCache, runCommand } from './run-script'

export default function() {
  const existingWebview = getWebview(identifier)
  if (existingWebview) {
    if (existingWebview.isVisible()) {
      // close the devtool if it's open
      existingWebview.close()
    }
    return
  }

  const browserWindow = new BrowserWindow({
    identifier,
    width: 830,
    height: 400,
    minWidth: 700,
    minHeight: 300,
    minimizable: false,
    maximizable: false,
    alwaysOnTop: Settings.settingForKey('alwaysOnTop') || false,
    fullscreenable: false,
    acceptFirstMouse: true,
    title: 'Sketch DevTools',
    resizable: true,
    show: false,
  })

  browserWindow.loadURL(require('../resources/webview.html'))

  browserWindow.once('ready-to-show', () => {
    const settings = {
      withAncestors: Settings.settingForKey('withAncestors') || false,
      alwaysOnTop: Settings.settingForKey('alwaysOnTop') || false,
      theme: Settings.settingForKey('theme') || 'light',
      showTimestamps: Settings.settingForKey('showTimestamps') || false,
    }
    browserWindow.webContents.executeJavaScript(
      `sketchBridge(${JSON.stringify({
        name: SET_SETTINGS,
        payload: settings,
      })})`
    )

    browserWindow.show()

    // enabled listening to all the actions
    AppController.sharedInstance()
      .pluginManager()
      .setWilcardsEnabled(true)
  })

  browserWindow.on('closed', () => {
    AppController.sharedInstance()
      .pluginManager()
      .setWilcardsEnabled(false)
  })

  browserWindow.webContents.on('openFile', file => {
    NSWorkspace.sharedWorkspace().openFile(file)
  })

  browserWindow.webContents.on('getSketchState', () => {
    const state = getSketchState()

    browserWindow.webContents.executeJavaScript(
      `sketchBridge(${JSON.stringify({ name: SET_TREE, payload: state })})`
    )
  })

  browserWindow.webContents.on('setSetting', (key, value) => {
    Settings.setSettingForKey(key, value)

    if (String(key) === 'alwaysOnTop') {
      browserWindow.setAlwaysOnTop(value)
    }
  })

  browserWindow.webContents.on('getPageMetadata', (pageId, docId) => {
    const state = getPageMetadata(pageId, docId)

    browserWindow.webContents.executeJavaScript(
      `sketchBridge(${JSON.stringify({
        name: SET_PAGE_METADATA,
        payload: { pageId, docId, state },
      })})`
    )
  })

  browserWindow.webContents.on('getLayerMetadata', (layerId, pageId, docId) => {
    const state = getLayerMetadata(layerId, pageId, docId)

    browserWindow.webContents.executeJavaScript(
      `sketchBridge(${JSON.stringify({
        name: SET_LAYER_METADATA,
        payload: { layerId, pageId, docId, state },
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
