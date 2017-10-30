import { createStore, applyMiddleware } from 'redux'
import rootReducer from './ducks'
import middlewares from './middlewares'

const store = applyMiddleware(...middlewares)(createStore)(rootReducer)

export default store
