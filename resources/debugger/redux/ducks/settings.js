import { SET_SETTINGS } from '../../../../shared-actions'

const UPDATE_SETTING = 'settings/UPDATE_SETTING'

const initialState = {
  withAncestors: false,
  alwaysOnTop: false,
  theme: 'light',
  showTimestamps: false,
}

const handlers = {}

export const setSettings = ({ settings }) => ({
  type: SET_SETTINGS,
  payload: settings,
})

handlers[SET_SETTINGS] = (state, { payload }) => ({
  ...state,
  ...payload,
})

const updateSettingAction = key => value => ({
  type: UPDATE_SETTING,
  payload: {
    key,
    value,
  },
  meta: {
    sketch: ['setSetting', key, value],
  },
})

handlers[UPDATE_SETTING] = (state, { payload }) => ({
  ...state,
  [payload.key]: payload.value,
})

export const updateWithAncestors = updateSettingAction('withAncestors')
export const updateAlwaysOnTop = updateSettingAction('alwaysOnTop')
export const updateTheme = updateSettingAction('theme')
export const updateShowTimestamps = updateSettingAction('showTimestamps')

export default function(state = initialState, action) {
  if (handlers[action.type]) {
    return handlers[action.type](state, action)
  }

  return state
}
