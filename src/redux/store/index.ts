import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { combineReducers } from 'redux';
import leadReducer from '../reducers/lead-reducer';
import userReducer from '../reducers/user-reducer';
import campaignReducer from '../reducers/campaign-reducer';
import locationReducer from '../reducers/location-reducer';
import otpReducer from '../reducers/otp-reducer';
import AsyncStorage from '@react-native-community/async-storage';
import { logger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import forgotPasswordReducer from '../reducers/forgot-password-reducer';
import connectionStateReducer from '../reducers/connection-reducer';
import metaDataReducer from '../reducers/meta-data-reducer';
import errorReducer from '../reducers/error-reducer';
import leadReportReducer from '../reducers/lead-report-reducer';

const rootReducer = combineReducers({
    leadReducer: leadReducer,
    userReducer: userReducer,
    campaignReducer: campaignReducer,
    locationReducer: locationReducer,
    otpReducer: otpReducer,
    forgotPasswordReducer: forgotPasswordReducer,
    connectionStateReducer: connectionStateReducer,
    metaDataReducer: metaDataReducer,
    errorReducer: errorReducer,
    leadReportReducer: leadReportReducer,
});

const middleware = [thunk];

// Middleware: Redux Persist Config
const persistConfig = {
    timeout: 0,
    // Root?
    key: 'root',
    // Storage Method (React Native)
    storage: AsyncStorage,
    stateReconciler: autoMergeLevel2,
    // Whitelist (Save Specific Reducers)
    whitelist: ['userReducer', 'leadReducer', 'campaignReducer', 'metaDataReducer', 'leadReportReducer'],
};

// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(...middleware, logger));

// Middleware: Redux Persist Persister
let persistor = persistStore(store);

export { store, persistor };
export type AppState = ReturnType<typeof rootReducer>;
