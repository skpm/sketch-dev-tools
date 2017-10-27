import { sendToDebugger, prepareValue } from '../debugger'
import { ADD_ACTION } from '../shared-actions'

// eslint-disable-next-line
export function onAction(context) {
  return sendToDebugger(ADD_ACTION, {
    name: String(context.action),
    context: prepareValue(context.actionContext),
  })
}
