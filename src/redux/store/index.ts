import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { combineReducers } from 'redux';
import leadReducer from '../reducers/lead-reducer';
import userReducer from '../reducers/user-reducer';
import campaignReducer from '../reducers/campaign-reducer';
import locationReducer from '../reducers/location-reducer';
import AsyncStorage from '@react-native-community/async-storage';
import { logger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const rootReducer = combineReducers({
    leadReducer: leadReducer,
    userReducer: userReducer,
    campaignReducer: campaignReducer,
    locationReducer: locationReducer,
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
    whitelist: ['userReducer', 'leadReducer', 'campaignReducer'],
};

// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(...middleware, logger));

// Middleware: Redux Persist Persister
let persistor = persistStore(store);

export { store, persistor };
export type AppState = ReturnType<typeof rootReducer>;
