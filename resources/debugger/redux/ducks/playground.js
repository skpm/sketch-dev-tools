import { RUN_SCRIPT } from '../../../../shared-actions'

const SET_SCRIPT_VALUE = 'playground/SET_SCRIPT_VALUE'

const initialState = {
  currentScript: 'console.log(context)',
}

const handlers = {}

export const setScriptValue = text => ({
  type: SET_SCRIPT_VALUE,
  payload: {
    text,
  },
})

handlers[SET_SCRIPT_VALUE] = (state, { payload }) => ({
  ...state,
  currentScript: payload.text,
})

export const runScript = script => ({
  type: RUN_SCRIPT,
  meta: {
    sketch: ['onRunScript', script],
  },
})

export default function(state = initialState, action) {
  if (handlers[action.type]) {
    return handlers[action.type](state, action)
  }

  return state
}
