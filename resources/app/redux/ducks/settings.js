/* globals window */
const UPDATE_SETTING = 'settings/UPDATE_SETTING'

const initialState = window.initialSettings || {
  withAncestors: false,
  alwaysOnTop: false,
  theme: 'light',
  showTimestamps: false,
  sourcemaps: true,
  playgroundEditorWidth: 300,
}

const handlers = {}

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
export const updateSourcemaps = updateSettingAction('sourcemaps')
export const updatePlaygrounEditorWidth = updateSettingAction(
  'playgroundEditorWidth'
)

export default function(state = initialState, action) {
  if (handlers[action.type]) {
    return handlers[action.type](state, action)
  }

  return state
}
