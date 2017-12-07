import { SET_SCRIPT_RESULT } from '../../../../shared-actions'

const CLEAR_CACHE = 'playground/CLEAR_CACHE'
const RUN_SCRIPT = 'playground/RUN_SCRIPT'
const SET_SCRIPT_VALUE = 'playground/SET_SCRIPT_VALUE'
const RUN_COMMAND = 'playground/RUN_COMMAND'

const initialState = {
  currentScript: 'console.log(context)',
  loading: false,
  runId: 0,
  result: undefined,
  timestamp: {
    start: null,
    end: null,
  },
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

export const runScript = (script, runId) => ({
  type: RUN_SCRIPT,
  payload: {
    runId: runId + 1,
  },
  meta: {
    sketch: ['onRunScript', script, runId + 1],
  },
})

handlers[RUN_SCRIPT] = (state, { payload }) => ({
  ...state,
  loading: true,
  runId: payload.runId,
  timestamp: {
    start: Date.now(),
    end: null,
  },
})

export const setScriptResult = ({ id, result }) => ({
  type: SET_SCRIPT_RESULT,
  payload: {
    id,
    result,
  },
})

handlers[SET_SCRIPT_RESULT] = (state, { payload }) => {
  if (payload.id !== state.runId) {
    return state
  }

  return {
    ...state,
    result: payload.result,
    loading: false,
    timestamp: {
      ...state.timestamp,
      end: Date.now(),
    },
  }
}

export const clearCache = () => ({
  type: CLEAR_CACHE,
  meta: {
    sketch: ['clearScriptsCache'],
  },
})

export const runCommand = (command, runId) => ({
  type: RUN_COMMAND,
  payload: {
    runId: runId + 1,
  },
  meta: {
    sketch: ['onRunCommand', command, runId + 1],
  },
})

handlers[RUN_COMMAND] = (state, { payload }) => ({
  ...state,
  loading: true,
  runId: payload.runId,
  timestamp: {
    start: Date.now(),
    end: null,
  },
})

export default function(state = initialState, action) {
  if (handlers[action.type]) {
    return handlers[action.type](state, action)
  }

  return state
}
