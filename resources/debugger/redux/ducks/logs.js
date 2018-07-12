import {
  ADD_LOG,
  CLEAR_LOGS,
  GROUP,
  GROUP_END,
} from '../../../../shared-actions'

const SET_SEARCH = 'logs/SET_SEARCH'
const SET_TYPES = 'logs/SET_TYPES'
const SELECT_VALUE = 'logs/SELECT_VALUE'

const initialState = {
  logs: [],
  clearTs: Date.now(),
  search: '',
  types: {
    log: true,
    info: true,
    warn: true,
    error: true,
  },
  selectedLog: null,
  selectedLogValue: null,
  groups: {},
}

const handlers = {}

export const addLog = log => ({
  type: ADD_LOG,
  payload: {
    log,
  },
})

handlers[ADD_LOG] = (state, { payload }) => ({
  ...state,
  logs: state.logs.concat({
    ...payload.log,
    group: state.groups[payload.log.plugin] || 0,
  }),
})

export const clearLogs = () => ({
  type: CLEAR_LOGS,
})

handlers[CLEAR_LOGS] = state => ({
  ...state,
  logs: [],
  clearTs: Date.now(),
})

export const setSearch = search => ({
  type: SET_SEARCH,
  payload: {
    search,
  },
})

handlers[SET_SEARCH] = (state, { payload }) => ({
  ...state,
  search: payload.search,
})

export const setTypes = types => ({
  type: SET_TYPES,
  payload: {
    types,
  },
})

handlers[SET_TYPES] = (state, { payload }) => ({
  ...state,
  types: payload.types,
})

export const selectValue = (key, value) => ({
  type: SELECT_VALUE,
  payload: {
    key,
    value,
  },
})

handlers[SELECT_VALUE] = (state, { payload }) => ({
  ...state,
  selectedLog: payload.key,
  selectedLogValue: payload.value,
})

export const group = ({ plugin }) => ({
  type: GROUP,
  payload: {
    plugin,
  },
})

handlers[GROUP] = (state, { payload }) => ({
  ...state,
  groups: {
    ...state.groups,
    [payload.plugin]: (state.groups[payload.plugin] || 0) + 1,
  },
})

export const groupEnd = ({ plugin }) => ({
  type: GROUP_END,
  payload: {
    plugin,
  },
})

handlers[GROUP_END] = (state, { payload }) => ({
  ...state,
  groups: {
    ...state.groups,
    [payload.plugin]: Math.max((state.groups[payload.plugin] || 0) - 1, 0),
  },
})

export default function(state = initialState, action) {
  if (handlers[action.type]) {
    return handlers[action.type](state, action)
  }

  return state
}
