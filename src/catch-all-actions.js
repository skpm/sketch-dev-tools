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
  const options = {
    withAncestors: Settings.settingForKey('withAncestors') || false,
  }
  const name = String(context.action)
  if (name === LOG_ACTION) {
    const ourCommand = String(__command.identifier())
    const commandTriggeringTheLog = String(
      context.actionContext.command.identifier()
    )
    if (commandTriggeringTheLog !== ourCommand) {
      const values = []
      const nativeValues = context.actionContext.payload
      for (let i = 0; i < nativeValues.length; i += 1) {
        values.push(prepareValue(nativeValues[i], options))
      }
      const payload = {
        ts: Date.now(),
        type: String(context.actionContext.level),
        values,
        stack: [
          {
            file: String(context.actionContext.command.identifier()),
          },
        ],
      }

      sendToDebugger(ADD_LOG, payload)
    }
  }
  sendToDebugger(ADD_ACTION, {
    name,
    context: prepareValue(context.actionContext, options),
  })
}
