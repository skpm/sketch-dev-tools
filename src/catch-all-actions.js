/* globals __command */
import Settings from 'sketch/settings' // eslint-disable-line
import { prepareValue } from 'sketch-utils'
import { isDebuggerPresent, sendToDebugger } from '../debugger'
import { ADD_ACTION, ADD_LOG } from '../shared-actions'

const LOG_ACTION = 'Log.finish'

// eslint-disable-next-line
export function onAction(context) {
  if (!isDebuggerPresent()) {
    return undefined
  }
  const { action, actionContext } = context
  const options = {
    withAncestors: Settings.settingForKey('withAncestors') || false,
    sourcemaps:
      typeof Settings.settingForKey('sourcemaps') !== 'undefined'
        ? Settings.settingForKey('sourcemaps')
        : true,
  }
  const name = String(action)
  if (name === LOG_ACTION) {
    const ourCommand = String(__command.identifier())
    const commandTriggeringTheLog = String(actionContext.command.identifier())
    if (commandTriggeringTheLog !== ourCommand) {
      const values = []
      const nativeValues = actionContext.payload
      for (let i = 0; i < nativeValues.length; i += 1) {
        values.push(prepareValue(nativeValues[i], options))
      }
      const payload = {
        ts: Date.now(),
        type: String(actionContext.level),
        values,
        stack: [
          {
            file: commandTriggeringTheLog,
          },
        ],
      }

      sendToDebugger(ADD_LOG, payload)
    }
  }
  sendToDebugger(ADD_ACTION, {
    name,
    context: prepareValue(actionContext, options),
  })
}
