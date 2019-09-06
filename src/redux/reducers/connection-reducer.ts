import { CHANGE_CONNECTION_STATUS } from '../actions/action-types';

const initialState = {
    isConnected: false,
};

const connectionStateReducer = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_CONNECTION_STATUS:
            console.log('CHANGE_CONNECTION_STATUS', action);
            return {
                ...state,
                isConnected: action.payload.status,
            };
        default:
            return state;
    }
};

export default connectionStateReducer;
