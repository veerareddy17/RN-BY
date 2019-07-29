import { combineReducers } from 'redux'
import leadReducer from './leadReducer'

export default combineReducers({
  leads: leadReducer,
})
