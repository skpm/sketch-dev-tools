import pluginCall from 'sketch-module-web-view/client'

export default () => next => action => {
  const res = next(action)

  if (action.meta && action.meta.sketch) {
    pluginCall.apply(this, action.meta.sketch)
  }

  return res
}
