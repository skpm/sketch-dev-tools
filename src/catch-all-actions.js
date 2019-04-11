/* globals __command, NSClassFromString */
import util from 'util'
import Settings from 'sketch/settings'
import { prepareValue, prepareObject, prepareStackTrace } from 'sketch-utils'
import { isDebuggerPresent, sendToDebugger } from '../debugger'
import { ADD_ACTION, ADD_LOG } from '../shared-actions'

const LOG_ACTION = 'Log.finish'

function getName(x) {
  return {
    type: 'String',
    primitive: 'String',
    value: String(x.name()),
  }
}

function getSelector(x) {
  return {
    type: 'String',
    primitive: 'String',
    value: String(x.selector()),
  }
}

function introspectMochaObject(mocha, options = {}) {
  const introspection = {
    properties: {
      type: 'Array',
      primitive: 'Array',
      value: util
        .toArray(
          mocha[`properties${options.withAncestors ? 'WithAncestors' : ''}`]()
        )
        .map(getName),
    },
    classMethods: {
      type: 'Array',
      primitive: 'Array',
      value: util
        .toArray(
          mocha[`classMethods${options.withAncestors ? 'WithAncestors' : ''}`]()
        )
        .map(getSelector),
    },
    instanceMethods: {
      type: 'Array',
      primitive: 'Array',
      value: util
        .toArray(
          mocha[
            `instanceMethods${options.withAncestors ? 'WithAncestors' : ''}`
          ]()
        )
        .map(getSelector),
    },
    protocols: {
      type: 'Array',
      primitive: 'Array',
      value: util
        .toArray(
          mocha[`protocols${options.withAncestors ? 'WithAncestors' : ''}`]()
        )
        .map(getName),
    },
  }
  if (mocha.treeAsDictionary && options.withTree) {
    introspection.treeAsDictionary = {
      type: 'Object',
      primitive: 'Object',
      value: prepareObject(mocha.treeAsDictionary(), options),
    }
  }
  return introspection
}

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

  if (commandTriggeringTheLog === ourCommand) {
    return
  }

  let values = null
  if (actionContext.payload[0] && actionContext.payload[0].value) {
    values = JSON.parse(
      JSON.stringify(actionContext.payload[0].value, (key, value) => {
        const castedValue = util.toJSObject(value)
        if (String(castedValue.primitive) === 'Mocha') {
          const nativeClass = NSClassFromString(castedValue.value)
          castedValue.value = introspectMochaObject(
            nativeClass.mocha(),
            options
          )
        } else if (
          String(castedValue.primitive) === 'Error' &&
          castedValue.value.stack
        ) {
          castedValue.value = castedValue.value.mutableCopy()
          castedValue.value.stack = prepareStackTrace(
            castedValue.value.stack,
            options
          )
        }
        return castedValue
      })
    )
  } else if (actionContext.stringValue) {
    // weak support of previous version of Sketch
    values = [
      {
        value: String(actionContext.stringValue),
        type: 'String',
        primitive: 'String',
      },
    ]
  } else {
    return
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
