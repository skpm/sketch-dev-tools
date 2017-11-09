import pluginCall from 'sketch-module-web-view/client'

export default () => next => action => {
  const res = next(action)

  if (action.meta && action.meta.sketch) {
    setTimeout(() => pluginCall.apply(this, action.meta.sketch), 0)
  }

  return res
}
