import { LOCATION_CAPTURE_FAILURE, LOCATION_CAPTURE_START } from './../actions/action-types';
import { LOCATION_CAPTURE_SUCCESS } from "../actions/action-types";

export const initialState = {
    location: {},
    status: '',
    isLoading: false,
};

export default function locationReducer(state = initialState, action) {
    console.log('type,payload', action.type, action.payload)
    switch (action.type) {
        case LOCATION_CAPTURE_START:
            return {
                ...state,
                status: 'done',
                isLoading: true,
                location: action.payload,
            };
        case LOCATION_CAPTURE_SUCCESS:
            return {
                ...state,
                status: 'success',
                isLoading: false,
                location: action.payload,
            };

        case LOCATION_CAPTURE_FAILURE:
            return {
                ...state,
                status: 'fail',
                isLoading: false,
                error: action.payload,
            };
        default:
            return state;
    }
}