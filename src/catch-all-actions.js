/* globals __command */
import Settings from 'sketch/settings'
import { prepareValue } from 'sketch-utils'
import { isDebuggerPresent, sendToDebugger } from '../debugger'
import { ADD_ACTION, ADD_LOG } from '../shared-actions'

const LOG_ACTION = 'Log.finish'

export function onLogFinish(context) {
  if (!isDebuggerPresent()) {
    return
  }

  const { actionContext } = context
  const options = {
    withAncestors: Settings.settingForKey('withAncestors') || false,
    sourcemaps:
      typeof Settings.settingForKey('sourcemaps') !== 'undefined'
        ? Settings.settingForKey('sourcemaps')
        : true,
  }

  const ourCommand = String(__command.identifier())
  const commandTriggeringTheLog = String(actionContext.command.identifier())

  let value

  try {
    value = prepareValue(actionContext, options)
  } catch (err) {
    value = {
      value: {
        payload: {
          value: [actionContext.stringValue],
        },
      },
    }
  }

  if (commandTriggeringTheLog !== ourCommand) {
    const payload = {
      ts: Date.now(),
      type: String(actionContext.level),
      values: value.value.payload.value,
      stack: [
        {
          file: commandTriggeringTheLog,
        },
      ],
    }

    sendToDebugger(ADD_LOG, payload)
  }

  sendToDebugger(ADD_ACTION, {
    name: 'Log.finish',
    context: value,
  })
}

// eslint-disable-next-line
export function onAction(context) {
  if (!isDebuggerPresent()) {
    return
  }
  const { action, actionContext } = context
  const name = String(action)

  if (name === LOG_ACTION) {
    // handled by the other action handler
    return
  }

  const options = {
    withAncestors: Settings.settingForKey('withAncestors') || false,
    sourcemaps:
      typeof Settings.settingForKey('sourcemaps') !== 'undefined'
        ? Settings.settingForKey('sourcemaps')
        : true,
  }
  try {
    sendToDebugger(ADD_ACTION, {
      name,
      context: prepareValue(actionContext, options),
    })
  } catch (err) {
    // ignore
  }
}
