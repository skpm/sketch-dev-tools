import { combineReducers } from 'redux'

// Import reducers
import actions from './actions'
import logs from './logs'
import elements from './elements'
import network from './network'
import playground from './playground'

export default combineReducers({
  actions,
  logs,
  elements,
  playground,
  network,
})
