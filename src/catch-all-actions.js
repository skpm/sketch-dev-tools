import { prepareValue } from 'sketch-utils'
import { isDebuggerPresent, sendToDebugger } from '../debugger'
import { ADD_ACTION } from '../shared-actions'

// eslint-disable-next-line
export function onAction(context) {
  if (!isDebuggerPresent()) {
    return undefined
  }
  return sendToDebugger(ADD_ACTION, {
    name: String(context.action),
    context: prepareValue(context.actionContext),
  })
}
