/* globals window */

export default () => next => action => {
  const res = next(action)

  if (action.meta && action.meta.sketch) {
    if (!Array.isArray(action.meta.sketch)) {
      throw new Error('sketch meta key needs to be an array')
    }
    setTimeout(() => window.postMessage(...action.meta.sketch), 0)
  }

  return res
}
