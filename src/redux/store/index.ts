import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from '../reducers';

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
console.log('getstate', store.getState());
export default store;
