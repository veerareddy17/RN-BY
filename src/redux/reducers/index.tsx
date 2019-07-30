import { combineReducers } from 'redux'
import leads from './leadReducer'

const rootReducer = combineReducers({
  leads: leads,
});

export default rootReducer;
