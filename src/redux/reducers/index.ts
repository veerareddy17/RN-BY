import { combineReducers } from 'redux';
import leadReducer from './leadReducer';
import userReducer from './userReducer';
import campaignReducer from './campaignReducer';

const rootReducer = combineReducers({
    leads: leadReducer,
    user: userReducer,
    campaigns: campaignReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
