import { combineReducers } from 'redux'

// Import reducers
import actions from './actions'
import logs from './logs'
import elements from './elements'
import network from './network'

export default combineReducers({
  actions,
  logs,
  elements,
  network,
})
