import sketchPlugin from './sketch-plugin'

const middlewares = [sketchPlugin]

if (process.env.NODE_ENV !== 'production') {
  const { createLogger } = require('redux-logger') // eslint-disable-line
  const logger = createLogger({
    collapsed: true,
    duration: true,
    timestamp: false,
    predicate: (getState, action) => action.type !== 'REDUX_STORAGE_SAVE',
  })
  middlewares.push(logger)
}

export default middlewares
