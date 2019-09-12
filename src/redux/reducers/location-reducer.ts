import { LOCATION_CAPTURE_FAILURE, LOCATION_CAPTURE_START, LOCATION_CAPTURE_SUCCESS } from '../actions/action-types';
import { LocationState, LocationActionTypes } from '../init/location-initial-state';

export const initialState: LocationState = {
    location: { latitude: 0, longitude: 0 },
    status: '',
    isLoading: false,
};

export default function locationReducer(state = initialState, action: LocationActionTypes): LocationState {
    switch (action.type) {
        case LOCATION_CAPTURE_START:
            return {
                ...state,
                isLoading: true,
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
            };
        default:
            return state;
    }
}
