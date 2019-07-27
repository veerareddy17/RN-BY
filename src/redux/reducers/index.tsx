import { combineReducers } from 'redux'
import leads from './leadReducer'

export default combineReducers({
  leads: leads,
})
