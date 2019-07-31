import { combineReducers } from 'redux';
import leadReducer from './leadReducer';
import userReducer from './userReducer';
import campaignReducer from './campaignReducer';

export default combineReducers({
    leads: leadReducer,
    user: userReducer,
    campaigns: campaignReducer,
});
